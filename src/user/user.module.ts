import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from '../common/db/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    DrizzleModule,
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
