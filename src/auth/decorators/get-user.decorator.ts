import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../types/current-user';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();
  return user as CurrentUser;
});
