import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/common';
import { SessionSerializer } from './utils/Serializer';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService
    }
  ],
})
export class AuthModule {}
