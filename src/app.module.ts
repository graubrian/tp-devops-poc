import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { loggerConfig } from './logging/logger.config';
import { TareasModule } from './tareas/tareas.module';

@Module({
  imports: [LoggerModule.forRoot(loggerConfig()), HealthModule, TareasModule],
})
export class AppModule {}
