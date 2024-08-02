import { Body, Controller, HttpCode, Post, Res, UseFilters, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpExceptionFilter } from '../filter/httpException';
import { DataResponse } from '../types/http/response.types';
import { UserResponse } from '../types/entity/user.types';
import { LoginDto, RegisterDto } from './user.dto';
import { Response } from 'express';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  @HttpCode(201)
  async register(
    @Body(ValidationPipe) request: RegisterDto,
  ): Promise<DataResponse<UserResponse>> {
    const user = await this.userService.Register(request);
    return {
      data: user,
      message: "Account Register successfully",
      errors: null,
    }
  }

  @Post("/login")
  @HttpCode(200)
  async login(
    @Body(ValidationPipe) request: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<DataResponse<UserResponse>> {
    const token = await this.userService.Login(request);

    response.cookie('access', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    response.cookie('refresh', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      data: null,
      message: "Login successfully",
      errors: null,
    };
  }
}
