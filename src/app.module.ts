import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RedisClientOptions } from 'redis';
import { FipeModule } from './fipe/fipe.module';
import { AdminModule } from './admin/admin.module';
import redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    FipeModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 600,
      isGlobal: true,
    }),
    AdminModule,
  ],
})
export class AppModule {}
