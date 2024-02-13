import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
        super();
    }

    serializeUser(user: any, done: Function) {
        console.log('serializeUser');
        done(null, user)
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.authService.findUser(payload.id)
        console.log(`deserializeUser, user: ${JSON.stringify(user)}`);

        // if (user) {
        //     // Check for session expiration (assuming you have a session expiration timestamp)
        //     const sessionExpired = user.sessionExpiresAt && Date.now() > user.sessionExpiresAt;

        //     if (!sessionExpired) {
        //       console.log(`deserializeUser, user: ${JSON.stringify(user)}`);
        //       return done(null, user);
        //     } else {
        //       console.log('Session expired.');
        //     }
        //   }

        //   console.log('User not found or session expired.');
        //   return done(null, null);

        return user ? done(null, user) : done(null, null)
    }
}