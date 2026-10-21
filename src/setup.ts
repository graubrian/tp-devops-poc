import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Configuración compartida entre main.ts y los tests e2e
export function configurarApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('TP DevOps - API de Tareas')
    .setDescription('API de ejemplo para el trabajo práctico integrador')
    .setVersion(process.env.APP_VERSION ?? 'dev')
    .build();
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documento, { jsonDocumentUrl: 'docs-json' });
}
