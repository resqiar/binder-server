import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ProtectedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Check if the logged in user is admin
    const isAdmin = await this.userService.findAdminById(userId);

    if (!isAdmin) return false;
    return true;
  }
}
