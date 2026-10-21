import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { TareasModule } from './tareas/tareas.module';

@Module({
  imports: [HealthModule, TareasModule],
})
export class AppModule {}
