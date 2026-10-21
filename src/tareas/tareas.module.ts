import { Module } from '@nestjs/common';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
