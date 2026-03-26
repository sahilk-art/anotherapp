import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { RefreshToken } from './schemas/refresh-token.schema';
import { IAuthResponse } from '../../../shared/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(OTP.name) private otpModel: Model<OTP>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async register(data: any): Promise<IAuthResponse> {
    // Implementation
    const payload = { email: data.email, sub: 'user_id' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { email: data.email, id: 'user_id' },
    };
  }

  async sendOtp(data: any) {
    return { success: true, message: 'OTP sent' };
  }

  async verifyOtp(data: any) {
    return { success: true, message: 'OTP verified' };
  }

  async login(data: any): Promise<IAuthResponse> {
    const payload = { phone: data.phone, sub: 'user_id' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { phone: data.phone, id: 'user_id' },
    };
  }

  async loginPassword(data: any): Promise<IAuthResponse> {
    const payload = { email: data.email, sub: 'user_id' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { email: data.email, id: 'user_id' },
    };
  }

  async refreshToken(data: any) {
    try {
      const payload = this.jwtService.verify(data.refreshToken);
      const newPayload = { email: payload.email, sub: payload.sub };
      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(data: any) {
    return { success: true, message: 'Logged out' };
  }

  async forgotPassword(data: any) {
    return { success: true, message: 'Reset password OTP sent' };
  }

  async resetPassword(data: any) {
    return { success: true, message: 'Password reset successful' };
  }

  async getMe(data: any) {
    return { id: 'user_id', email: 'test@example.com' };
  }
}
