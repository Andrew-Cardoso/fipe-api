import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/utils/email/email.module';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from './strategy/jwt.constants';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    EmailModule,
    PrismaModule,
    UuidModule,
    JwtModule.register({
      secret: JWT.secret,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
