import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { RefreshToken } from './schemas/refresh-token.schema';
import { IAuthResponse } from '../../../../shared/interfaces';
import { OTPType } from '../../../../../shared/enums';
import { SendOtpDto, VerifyOtpDto, RegisterDto, LoginPasswordDto, RefreshTokenDto } from '../../../../shared/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(OTP.name) private otpModel: Model<OTP>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async sendOtp(data: SendOtpDto): Promise<{ success: boolean; otp?: string }> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.otpModel.create({
      phone: data.phone,
      otp: hashedOtp,
      type: data.type || OTPType.LOGIN,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log(`Sending OTP ${otp} to ${data.phone}`);
    // In production, integration with SMS gateway (Twilio/AWS SNS) would happen here.
    return { success: true, otp }; // Return OTP for testing in development
  }

  async verifyOtp(data: VerifyOtpDto): Promise<{ success: boolean }> {
    const record = await this.otpModel.findOne({ phone: data.phone, isVerified: false }).sort({ createdAt: -1 });
    if (!record) throw new UnauthorizedException('OTP not found');
    if (record.expiresAt < new Date()) throw new UnauthorizedException('OTP expired');

    const isValid = await bcrypt.compare(data.otp, record.otp);
    if (!isValid) throw new UnauthorizedException('Invalid OTP');

    record.isVerified = true;
    await record.save();
    return { success: true };
  }

  async register(data: RegisterDto): Promise<IAuthResponse> {
    // Generate a unique ID to simulate user creation in user-service
    const userId = new Types.ObjectId().toHexString();
    const tokens = this.generateTokens({ phone: data.phone, sub: userId });
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: userId, phone: data.phone, fullName: data.fullName, isVerified: true, role: 'PLAYER' }
    };
  }

  async login(data: { phone: string; userId: string }): Promise<IAuthResponse> {
    const tokens = this.generateTokens({ phone: data.phone, sub: data.userId });
    await this.saveRefreshToken(data.userId, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: data.userId, phone: data.phone, isVerified: true, role: 'PLAYER' }
    };
  }

  async loginPassword(data: LoginPasswordDto): Promise<IAuthResponse> {
    // Implementation for login with password
    // This would typically involve fetching the user from user-service
    const tokens = this.generateTokens({ email: data.email, sub: 'user_id' });
    await this.saveRefreshToken('user_id', tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { email: data.email, id: 'user_id', fullName: 'John Doe', isVerified: true, role: 'PLAYER' }
    };
  }

  private generateTokens(payload: { sub: string; [key: string]: any }) {
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

  async refreshToken(data: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(data.refreshToken);
      const storedToken = await this.refreshTokenModel.findOne({ userId: payload.sub, isRevoked: false }).sort({ createdAt: -1 });
      if (!storedToken) throw new UnauthorizedException('Invalid refresh token');

      const tokens = this.generateTokens({ sub: payload.sub, phone: payload.phone });
      storedToken.isRevoked = true;
      await storedToken.save();
      await this.saveRefreshToken(payload.sub, tokens.refreshToken);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    await this.refreshTokenModel.updateMany({ userId: new Types.ObjectId(userId) }, { isRevoked: true });
    return { success: true };
  }

  async getMe(userId: string, phone: string): Promise<any> {
    return { id: userId, phone, role: 'PLAYER' };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Logic to generate reset token and send email via notification-service
    return { success: true, message: 'Password reset link sent to your email' };
  }

  async resetPassword(data: any): Promise<{ success: boolean; message: string }> {
    // Logic to verify reset token and update password in user-service
    return { success: true, message: 'Password updated successfully' };
  }
}
