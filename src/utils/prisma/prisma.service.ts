import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Role, User } from '@prisma/client';
import { Roles, RolesEnum } from 'src/auth/constants/roles';
import { generateHashAndSalt } from 'src/auth/utils/crypto';
import { SMTP_CONFIG } from '../email/email.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    if (!(await this.role.count())) {
      const roles: Role[] = Roles.map((id) => ({
        name: RolesEnum[id],
        id,
      }));

      const { passwordHash, passwordSalt } = await generateHashAndSalt(
        process.env.ADMIN_PASSWORD,
      );

      const admin: User = {
        id: 1,
        accountVerified: true,
        email: SMTP_CONFIG.user,
        name: 'Admin',
        passwordHash,
        passwordSalt,
      };

      await this.user.create({ data: { ...admin, roles: { create: roles } } });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
