import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

type DoneFunction = (err: any, user?: any) => void;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: any, done: DoneFunction): void {
    console.log('serializeUser');
    done(null, user);
  }

  async deserializeUser(payload: any, done: DoneFunction): Promise<void> {
    const user = await this.authService.findUser(payload.id);
    console.log(`deserializeUser, user: ${JSON.stringify(user)}`);
    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  }
}
