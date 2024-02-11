import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { SessionSerializer } from './utils/Serializer';
import { GoogleStrategy } from './strategies/GoogleStrategy';


@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    AuthMiddleware,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService
    }
  ],
})
export class AuthModule { };
