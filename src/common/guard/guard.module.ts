import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
  ],
  providers: [AuthGuard],
  exports: [
    AuthGuard,
    AuthModule,
    UserModule,
  ]
})
export class GuardModule {}
