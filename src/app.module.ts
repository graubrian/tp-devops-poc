import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TareasModule } from './tareas/tareas.module';

@Module({
  imports: [TareasModule],
  controllers: [HealthController],
})
export class AppModule {}
