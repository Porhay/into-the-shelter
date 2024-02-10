import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountsModule } from './accounts.module';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport'
import * as connect from 'connect-pg-simple'

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const logger = new Logger('tycoonv-gateway:main');
  const config = app.get(ConfigService);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        // maxAge: 60000 * 60 * 24 // 1d
        maxAge: 30000
      },
      store: new (connect(session))({ // TODO: update lib
        conObject: {
          connectionString: 'postgres://root:root@localhost:5432/root',
        },
      }),
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())
  
  // Enable CORS
  app.enableCors();

  app.setGlobalPrefix('api');
  await app.listen(config.get('ACCOUNTS_PORT'), () => {
    logger.log(`Server is started on PORT: ${config.get('ACCOUNTS_PORT')}`)
  });
}
bootstrap();
