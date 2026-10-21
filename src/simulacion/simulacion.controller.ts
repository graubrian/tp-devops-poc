import {
  Controller,
  Get,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

@ApiTags('simulacion')
@Controller('simulacion')
export class SimulacionController {
  @Get('inestable')
  @ApiOperation({
    summary: 'Endpoint con latencia y errores aleatorios',
    description:
      'Simula una dependencia externa lenta. La tasa de error se controla con SIMULADOR_TASA_ERROR.',
  })
  @ApiOkResponse({ description: 'Respondió bien (esta vez)' })
  async inestable() {
    // la mayoría responde rápido, pero cada tanto hay una request lenta
    const demora =
      Math.random() < 0.1 ? 800 + Math.random() * 1500 : Math.random() * 250;
    await esperar(demora);

    const tasaError = Number(process.env.SIMULADOR_TASA_ERROR ?? 0.05);
    if (Math.random() < tasaError) {
      if (Math.random() < 0.5) {
        throw new ServiceUnavailableException('Dependencia no disponible');
      }
      throw new InternalServerErrorException('Falla inesperada');
    }

    return { ok: true, demora_ms: Math.round(demora) };
  }
}
