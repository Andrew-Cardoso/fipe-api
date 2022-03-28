import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RolesEnum } from 'src/auth/constants/roles';
import { CurrentUser } from 'src/auth/types/current-user';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

  async getUsers(currentUser: CurrentUser) {
    return await this.prisma.user.findMany({
      where: { email: { not: { equals: currentUser.email } } },
      include: { roles: true },
    });
  }

  async setAdmin(email: string, currentUser: CurrentUser) {
    if (email.toLowerCase() === currentUser.email.toLowerCase())
      throw new BadRequestException('Você já é um administrador');

    const dbUser = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!dbUser) throw new NotFoundException('Usuario nao encontrado');

    if (dbUser.roles.some(({ id }) => id === RolesEnum.ADMIN))
      throw new BadRequestException(`${dbUser.name} já é um administrador`);

    await this.prisma.user.update({
      where: { email },
      data: { roles: { connect: { id: RolesEnum.ADMIN } } },
    });
  }

  async resetCache() {
    await this.cacheManager.reset();
  }
}
