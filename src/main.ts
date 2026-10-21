import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurarApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  configurarApp(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
