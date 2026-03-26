import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { RefreshToken } from './schemas/refresh-token.schema';
import { IAuthResponse } from '../../../../shared/interfaces';
import { OTPType } from '../../../../../shared/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(OTP.name) private otpModel: Model<OTP>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async sendOtp(data: any) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.otpModel.create({
      phone: data.phone,
      otp: hashedOtp,
      type: data.type || OTPType.LOGIN,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log(`Sending OTP ${otp} to ${data.phone}`);
    return { success: true, message: 'OTP sent' };
  }

  async verifyOtp(data: any) {
    const record = await this.otpModel.findOne({ phone: data.phone, isVerified: false }).sort({ createdAt: -1 });
    if (!record || record.expiresAt < new Date()) throw new UnauthorizedException('OTP expired or not found');

    const isValid = await bcrypt.compare(data.otp, record.otp);
    if (!isValid) throw new UnauthorizedException('Invalid OTP');

    record.isVerified = true;
    await record.save();
    return { success: true, message: 'OTP verified' };
  }

  async register(data: any): Promise<IAuthResponse> {
    const payload = { phone: data.phone, sub: data.userId || new Types.ObjectId().toHexString() };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(payload.sub, tokens.refreshToken);
    return { ...tokens, user: data };
  }

  async login(data: any): Promise<IAuthResponse> {
    const payload = { phone: data.phone, sub: data.userId };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(payload.sub, tokens.refreshToken);
    return { ...tokens, user: { id: data.userId, phone: data.phone } };
  }

  async loginPassword(data: any): Promise<IAuthResponse> {
    // In a real app, verify email/password from user-service
    const payload = { email: data.email, sub: data.userId || 'mock_id' };
    const tokens = this.generateTokens(payload);
    await this.saveRefreshToken(payload.sub, tokens.refreshToken);
    return { ...tokens, user: { email: data.email, id: payload.sub } };
  }

  private generateTokens(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    await this.refreshTokenModel.create({
      userId: new Types.ObjectId(userId),
      token: hashedToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  async refreshToken(data: any) {
    const payload = this.jwtService.verify(data.refreshToken);
    const storedToken = await this.refreshTokenModel.findOne({ userId: payload.sub, isRevoked: false }).sort({ createdAt: -1 });
    if (!storedToken) throw new UnauthorizedException('Invalid refresh token');

    const tokens = this.generateTokens({ phone: payload.phone, sub: payload.sub });
    storedToken.isRevoked = true;
    await storedToken.save();
    await this.saveRefreshToken(payload.sub, tokens.refreshToken);
    return tokens;
  }

  async logout(data: any) {
    await this.refreshTokenModel.updateMany({ userId: data.userId }, { isRevoked: true });
    return { success: true };
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
