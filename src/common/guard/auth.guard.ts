import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    console.log("CHECKING AUTH")

    const accessToken: string = request.cookies['access'];
    const refreshToken: string = request.cookies['refresh'];

    if(!accessToken || !refreshToken) {
      throw new UnauthorizedException("Session not found");
    }

    const accessTokenPayload = this.authService.verifyAccessToken(accessToken);
    if(accessTokenPayload) {
      request.userId = accessTokenPayload.userId
      return true
    }

    const refreshTokenPayload = await this.authService.verifyRefreshToken(refreshToken);
    if(!refreshTokenPayload) {
      throw new UnauthorizedException("Your Session has expired")
    }

    const refresh = await this.userService.RefreshToken(refreshTokenPayload.userId);
    if(!refresh) {
      throw new UnauthorizedException("Invalid Session");
    }

    const validateRefresh = await this.authService.verifyRefreshToken(refresh);
    if(!validateRefresh || refresh !== refreshToken) {
      throw new UnauthorizedException("Invalid Refresh token not found");
    }

    const newAccessToken = this.authService.generateAccessToken({
      userId: refreshTokenPayload.userId,
    });

    response.cookie('access', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    request.userId = refreshTokenPayload.userId
    return true;
  }
}