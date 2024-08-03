import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../common/db/schema';
import { LoginDto, ProfileDto, RegisterDto, ResetPasswordDto } from '../common/types/entity/request/user.dto';
import { eq } from 'drizzle-orm';
import { Session, UserResponse } from '../common/types/entity/response/user.types';

@Injectable()
export class UserService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly authService: AuthService
  ) {}

  async Register(newUser: RegisterDto): Promise<UserResponse> {
    const [userExist] = await this.db.select().from(schema.Users).where(eq(schema.Users.email, newUser.email));
    if (userExist) {
      throw new BadRequestException("user already exists");
    }

    const [user] = await this.db.insert(schema.Users).values({
      name: newUser.name,
      email: newUser.email,
      password: await this.authService.hashPassword(newUser.password),
    }).returning()

    return this.entityToResponse(user);
  }

  async Login(payload: LoginDto): Promise<Session> {
    const [userExist] = await this.db.select().from(schema.Users).where(eq(schema.Users.email, payload.email));

    if(!userExist || !await this.authService.comparePasswords(payload.password, userExist.password)) {
      throw new BadRequestException("invalid email or password");
    }

    const accessToken = this.authService.generateAccessToken({
      userId: userExist.id,
    });
    const refreshToken = this.authService.generateRefreshToken({
      userId: userExist.id,
    });

    await this.db.update(schema.Users)
      .set({
        token: refreshToken
      } as Partial<typeof schema.Users.$inferInsert>)
      .where(eq(schema.Users.id, userExist.id))

    return this.tokenToResponse(accessToken, refreshToken);
  }

  async RefreshToken(id: number): Promise<string> | null {
    const [userExist] = await this.db.select().from(schema.Users).where(eq(schema.Users.id, id));
    return userExist ? userExist.token : null;
  }

  async Logout(id: number): Promise<void> {
    const [userExist] = await this.db.select().from(schema.Users).where(eq(schema.Users.id, id));

    await this.db.update(schema.Users)
      .set({
        token: null
      } as Partial<typeof schema.Users.$inferInsert>)
      .where(eq(schema.Users.id, userExist.id))
  }

  async UpdatePassword(id: number, payload: ResetPasswordDto): Promise<void> {
    const [updatedUserPassword] = await this.db.update(schema.Users)
      .set({
        password: await this.authService.hashPassword(payload.password),
      } as Partial<typeof schema.Users.$inferInsert>)
      .where(eq(schema.Users.id, id))
      .returning();

    if (!updatedUserPassword) {
      throw new NotFoundException(`User not found`);
    }
  }

  async UpdateProfile(id: number, payload: ProfileDto): Promise<UserResponse> {
    const [updatedUserProfile] = await this.db.update(schema.Users)
      .set({
        name: payload.name,
        email: payload.email,
      } as Partial<typeof schema.Users.$inferInsert>)
      .where(eq(schema.Users.id, id))
      .returning();

    if (!updatedUserProfile) {
      throw new NotFoundException(`User not found`);
    }

    return this.entityToResponse(updatedUserProfile);
  }

  private entityToResponse(
    user: typeof schema.Users.$inferSelect
  ): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private tokenToResponse(
    accessToken: string,
    refreshToken: string,
  ): Session {
    return {
      accessToken,
      refreshToken,
    };
  }
}
