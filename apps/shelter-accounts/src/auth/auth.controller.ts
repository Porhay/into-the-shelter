import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/googleAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() req, @Res() res) {
    // const logger = new Logger('auth.controller');
    // const maxAge = 30 * 24 * 60 * 60 * 1000 // 30d
    // res.cookie('userId', req.user.id, { maxAge });
    // res.cookie('userSessionId', req.sessionID, { maxAge });
    // const clientUrl = this.configService.get<string>('CLIENT_URL');
    // return res.redirect(clientUrl)

    // TODO: make it in secure way!
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const redirectUrl = `${clientUrl}?userId=${req.user.id}&userSessionId=${req.sessionID}`;

    return res.redirect(redirectUrl);
  }

  @Get('status')
  user(@Req() req: Request) {
    console.log('request.user:', req.user);
    if (req.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
