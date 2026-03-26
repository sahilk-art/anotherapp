import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with phone/email' })
  register(@Body() data: any) {
    return this.authClient.send('auth.register', data);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to phone/email' })
  sendOtp(@Body() data: any) {
    return this.authClient.send('auth.sendOtp', data);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  verifyOtp(@Body() data: any) {
    return this.authClient.send('auth.verifyOtp', data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone + OTP' })
  login(@Body() data: any) {
    return this.authClient.send('auth.login', data);
  }

  @Post('login/password')
  @ApiOperation({ summary: 'Login with email + password' })
  loginPassword(@Body() data: any) {
    return this.authClient.send('auth.loginPassword', data);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  refreshToken(@Body() data: any) {
    return this.authClient.send('auth.refreshToken', data);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  logout(@Body() data: any) {
    return this.authClient.send('auth.logout', data);
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Logout from all devices' })
  logoutAll(@Body() data: any) {
    return this.authClient.send('auth.logoutAll', data);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send reset password OTP' })
  forgotPassword(@Body() data: any) {
    return this.authClient.send('auth.forgotPassword', data);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() data: any) {
    return this.authClient.send('auth.resetPassword', data);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  getMe(@Body() data: any) {
    return this.authClient.send('auth.getMe', data);
  }
}
