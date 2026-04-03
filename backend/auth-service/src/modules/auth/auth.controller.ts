import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RegisterDto, LoginPasswordDto, RefreshTokenDto } from '../../../../shared/dto/auth.dto';
import { IAuthResponse } from '../../../../shared/interfaces';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() data: RegisterDto): Promise<IAuthResponse> {
    return this.authService.register(data);
  }

  @MessagePattern('auth.sendOtp')
  async sendOtp(@Payload() data: SendOtpDto): Promise<{ success: boolean; otp?: string }> {
    return this.authService.sendOtp(data);
  }

  @MessagePattern('auth.verifyOtp')
  async verifyOtp(@Payload() data: VerifyOtpDto): Promise<{ success: boolean }> {
    return this.authService.verifyOtp(data);
  }

  @MessagePattern('auth.login')
  async login(@Payload() data: { phone: string; userId: string }): Promise<IAuthResponse> {
    return this.authService.login(data);
  }

  @MessagePattern('auth.loginPassword')
  async loginPassword(@Payload() data: LoginPasswordDto): Promise<IAuthResponse> {
    return this.authService.loginPassword(data);
  }

  @MessagePattern('auth.refreshToken')
  async refreshToken(@Payload() data: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(data);
  }

  @MessagePattern('auth.logout')
  async logout(@Payload() data: { userId: string }): Promise<{ success: boolean }> {
    return this.authService.logout(data.userId);
  }

  @MessagePattern('auth.logoutAll')
  async logoutAll(@Payload() data: { userId: string }): Promise<{ success: boolean }> {
    await this.authService.logout(data.userId);
    return { success: true };
  }

  @MessagePattern('auth.forgotPassword')
  async forgotPassword(@Payload() data: { email: string }): Promise<{ success: boolean; message: string }> {
    return this.authService.forgotPassword(data.email);
  }

  @MessagePattern('auth.resetPassword')
  async resetPassword(@Payload() data: any): Promise<{ success: boolean; message: string }> {
    return this.authService.resetPassword(data);
  }

  @MessagePattern('auth.getMe')
  async getMe(@Payload() data: { userId: string; phone: string }): Promise<any> {
    return this.authService.getMe(data.userId, data.phone);
  }
}
