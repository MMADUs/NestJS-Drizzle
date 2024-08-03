import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly secretKey = 'your_secret_key';
  private readonly accessExpiry = '1s';
  private readonly refreshExpiry = '1h';

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.accessExpiry });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.refreshExpiry });
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
