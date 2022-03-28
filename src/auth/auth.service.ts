import {
  BadRequestException,
  CACHE_MANAGER,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/utils/email/email.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { RolesEnum } from './constants/roles';
import { UserSignUpDto } from './dtos/user-sign-up.dto';
import { checkPassword, generateHashAndSalt } from './utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private emailService: EmailService,
    private prisma: PrismaService,
    private uuidService: UuidService,
    private jwtService: JwtService,
  ) {}
  async signInLocal(email: string, password: string) {
    const user = await this.validCredentials(email, password);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (!user.accountVerified)
      throw new UnauthorizedException(
        `Please, verify your account before login in.
        If you didnt receive our email please click the button "send email verification"
        to send again and check your spam.`,
      );

    return await this.createJwtToken(email, user.name, user.roles);
  }

  async signUpLocal({ email, name, password }: UserSignUpDto) {
    if (await this.getUser(email))
      throw new BadRequestException('User already exists');

    const { passwordHash, passwordSalt } = await generateHashAndSalt(password);
    await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        passwordSalt,
        roles: { connect: { id: RolesEnum.USER } },
      },
    });

    await this.sendVerificationEmail(name, email);
  }

  async checkUserAndSendVerificationEmail(email: string, password: string) {
    const user = await this.validCredentials(email, password);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    return await this.sendVerificationEmail(user.name, user.email);
  }

  async verifyUser(email: string, token: string) {
    const user = await this.getUser(email);

    if (!user)
      throw new NotFoundException('Email not found, do you have an account?');

    if (user.accountVerified)
      throw new BadRequestException('Your email has already been verified.');

    const cachedToken: string = await this.cacheManager.get(email);

    if (cachedToken !== token)
      throw new GoneException(
        'Your token has expired. Please, send another one to your email',
      );

    await Promise.all([
      this.prisma.user.update({
        where: { email },
        data: { accountVerified: true },
      }),
      this.cacheManager.del(email),
    ]);

    return await this.createJwtToken(email, user.name, user.roles);
  }

  private createJwtToken(email: string, name: string, roles: Role[]) {
    return this.jwtService.signAsync(
      {
        sub: email,
        name,
        roles,
      },
      {
        expiresIn: roles.some((role) => role.id === RolesEnum.ADMIN)
          ? '4h'
          : '31d',
      },
    );
  }

  private getUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }

  private async validCredentials(email: string, password: string) {
    const user = await this.getUser(email);

    if (!user) return null;

    const isPasswordCorrect = await checkPassword(
      password,
      user.passwordHash,
      user.passwordSalt,
    );

    return isPasswordCorrect ? user : null;
  }

  private async sendVerificationEmail(name: string, email: string) {
    const token = await this.uuidService.generate();
    await this.cacheManager.set(email, token);
    return this.emailService.sendEmail({
      to: email,
      subject: 'Welcome to Car Price Crawler',
      html: `
      <h3>Welcome ${name}</h3>
      <p>
        If it was you who created your account into our website, please
        <a href="http://localhost:3456/auth/verify-user?email=${email}&token=${token}">
          click here
        </a>
        to verify your account.
        Note: <strong>This button will be available only for the next 10 minutes<strong>
        <br>
        If it wasn't you, just ignore this email.
      </p>
      `,
    });
  }
}
