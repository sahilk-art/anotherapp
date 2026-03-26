import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  async register(@Payload() data: any) { return this.authService.register(data); }

  @MessagePattern('auth.sendOtp')
  async sendOtp(@Payload() data: any) { return this.authService.sendOtp(data); }

  @MessagePattern('auth.verifyOtp')
  async verifyOtp(@Payload() data: any) { return this.authService.verifyOtp(data); }

  @MessagePattern('auth.login')
  async login(@Payload() data: any) { return this.authService.login(data); }

  @MessagePattern('auth.loginPassword')
  async loginPassword(@Payload() data: any) { return this.authService.loginPassword(data); }

  @MessagePattern('auth.refreshToken')
  async refreshToken(@Payload() data: any) { return this.authService.refreshToken(data); }

  @MessagePattern('auth.logout')
  async logout(@Payload() data: any) { return this.authService.logout(data); }

  @MessagePattern('auth.logoutAll')
  async logoutAll(@Payload() data: any) { return { success: true }; }

  @MessagePattern('auth.forgotPassword')
  async forgotPassword(@Payload() data: any) { return this.authService.forgotPassword(data); }

  @MessagePattern('auth.resetPassword')
  async resetPassword(@Payload() data: any) { return this.authService.resetPassword(data); }

  @MessagePattern('auth.getMe')
  async getMe(@Payload() data: any) { return this.authService.getMe(data); }
}
