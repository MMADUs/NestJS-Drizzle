import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Put,
  Res,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpExceptionFilter } from '../common/filter/httpException';
import { DataResponse } from '../common/types/http/response.types';
import { UserResponse } from '../common/types/entity/response/user.types';
import { LoginDto, ProfileDto, RegisterDto, ResetPasswordDto } from '../common/types/entity/request/user.dto';
import { Response } from 'express';
import { GetUser } from '../common/decorator/userRequest';
import { AuthGuard } from '../common/guard/auth.guard';

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

  @UseGuards(AuthGuard)
  @Delete("/logout")
  @HttpCode(200)
  async logout(
    @GetUser() userId: number
  ): Promise<DataResponse<UserResponse>> {
    await this.userService.Logout(userId);
    return {
      data: null,
      message: "Logout successfully",
      errors: null,
    }
  }

  @UseGuards(AuthGuard)
  @Put("/password")
  @HttpCode(200)
  async updatePassword(
    @Body(ValidationPipe) request: ResetPasswordDto,
    @GetUser() userId: number
  ): Promise<DataResponse<void>> {
    await this.userService.UpdatePassword(userId, request)
    return {
      data: null,
      message: "Update password successfully",
      errors: null,
    }
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(200)
  async updateProfile(
    @Body(ValidationPipe) request: ProfileDto,
    @GetUser() userId: number
  ): Promise<DataResponse<UserResponse>> {
    const user = await this.userService.UpdateProfile(userId, request)
    return {
      data: user,
      message: "Update password successfully",
      errors: null,
    }
  }
}
