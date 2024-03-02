import * as passport from 'passport'
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as connect from 'connect-pg-simple'
import { AccountsModule } from './accounts.module';
// import { v4 as uuidv4 } from 'uuid';
import { sync as uid } from 'uid-safe'

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const logger = new Logger('shelter-accounts:main');
  const config = app.get(ConfigService);

  app.use(
    session({
      name: 'userSessionId',
      genid: () => `${uid(24)}`,
      secret: config.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: config.get('maxAge')
      },
      store: new (connect(session))({
        conObject: {
          connectionString: config.get('DATABASE_URL'),
        },
      }),
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = config.get('ACCOUNTS_PORT')
  await app.listen(port, () => {
    logger.log(`Server is started on PORT: ${port}`)
  });
}
bootstrap();
