import { Module } from '@nestjs/common';
import { SimulacionController } from './simulacion.controller';
import { SimuladorCargaService } from './simulador-carga.service';

@Module({
  controllers: [SimulacionController],
  providers: [SimuladorCargaService],
})
export class SimulacionModule {}
