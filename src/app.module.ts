import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { loggerConfig } from './logging/logger.config';
import { MetricsModule } from './metrics/metrics.module';
import { RaizController } from './raiz.controller';
import { SimulacionModule } from './simulacion/simulacion.module';
import { TareasModule } from './tareas/tareas.module';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig()),
    ScheduleModule.forRoot(),
    MetricsModule,
    HealthModule,
    TareasModule,
    SimulacionModule,
  ],
  controllers: [RaizController],
})
export class AppModule {}
