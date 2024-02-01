import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {Request} from 'express'
import { GoogleAuthGuard } from './guards/Guards';

@Controller('auth')
export class AuthController {

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return {msg: 'Google Authentication'}
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect() {
        return {msg: 'OK'}
    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated' };
        } else
            return {msg: 'Not Authenticated'}
    }
}
