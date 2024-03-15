import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { GameIoAdapter } from './websocket/game-io.adapter';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const logger = new Logger('shelter-gateway:main');
  const config = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix('api');
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.useWebSocketAdapter(new GameIoAdapter(app));

  const port = config.get('GATEWAY_PORT')
  await app.listen(port, () => {
    logger.log(`Server is started on port: ${port}`)
  });
}
bootstrap();