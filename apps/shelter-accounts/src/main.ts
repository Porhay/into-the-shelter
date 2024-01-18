import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountsModule } from './accounts.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const logger = new Logger('tycoonv-gateway:main');
  const config = app.get(ConfigService);
  
  await app.listen(config.get('ACCOUNTS_PORT'), () => {
    logger.log(`Server is started on PORT: ${config.get('ACCOUNTS_PORT')}`)
  });
}
bootstrap();
