import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './utils/session.serializer';
import { GoogleStrategy } from './strategies/GoogleStrategy';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
