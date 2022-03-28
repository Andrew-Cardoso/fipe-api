import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesEnum } from 'src/auth/constants/roles';
import { User } from 'src/auth/decorators/get-user.decorator';
import { UserDto } from 'src/auth/dtos/user.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CurrentUser } from 'src/auth/types/current-user';
import { MapTo } from 'src/interceptors/map-to.interceptor';
import { AdminService } from './admin.service';
import { UserEmailDto } from './dtos/user-email.dto';

@UseGuards(AuthGuard('jwt'), RoleGuard(RolesEnum.ADMIN))
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @MapTo(UserDto)
  @Get('/users')
  async getUsers(@User() currentUser: CurrentUser) {
    return await this.adminService.getUsers(currentUser);
  }

  @Post('/give-admin-role')
  async setAdmin(
    @Body() { email }: UserEmailDto,
    @User() currentUser: CurrentUser,
  ) {
    return await this.adminService.setAdmin(email, currentUser);
  }

  @Delete('/cache')
  async resetCache() {
    return await this.adminService.resetCache();
  }
}
