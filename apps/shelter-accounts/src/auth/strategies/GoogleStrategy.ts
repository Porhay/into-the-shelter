import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20'
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            clientID: '426609721588-1klo5t2t0p0o9ph0qp6nvp8pnqi4s3d9.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:8001/api/auth/google/redirect',
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
        })
        console.log(`Validate, user: ${JSON.stringify(user)}`);
        return user || null
    }
}