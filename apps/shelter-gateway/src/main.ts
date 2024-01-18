import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const logger = new Logger('shelter-gateway:main');
  const config = app.get(ConfigService);

  await app.listen(config.get('GATEWAY_PORT'), () => {
    logger.log(`Server is started on port: ${config.get('GATEWAY_PORT')}`)
  });
}
bootstrap();
