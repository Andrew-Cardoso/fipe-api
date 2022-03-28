import { Role } from '@prisma/client';

export interface CurrentUser {
  email: string;
  name: string;
  roles: Role[];
}
