import { Request } from 'express'
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/Guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly configService: ConfigService) { }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg: 'Google Authentication' }
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Req() req, @Res() res) {
        // Set HTTP-only cookie for session management
        console.log(req.session);
        console.log('Cookies:', req.headers.cookie);

        res.cookie('session', req.session, { httpOnly: true }); // httpOnly

        // Set accessible cookie for the client side
        res.cookie('userSessionId', req.sessionID, { maxAge: 3600000 }); // Expires in 1 hour
        res.cookie('userId', req.user.id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expires in 30 days
        const clientUrl = this.configService.get<string>('CLIENT_URL');
        return res.redirect(clientUrl)
    }

    @Get('status')
    user(@Req() req: Request) {
        console.log('request.user:', req.user);
        if (req.user) {
            return { msg: 'Authenticated' };
        } else {
            return { msg: 'Not Authenticated' }
        }
    }
}
