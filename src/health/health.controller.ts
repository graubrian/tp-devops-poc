import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

// Render free tiene 512 MB: si el heap pasa este límite reportamos el servicio como caído
const LIMITE_HEAP_BYTES = 300 * 1024 * 1024;

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  // Solo chequeos internos: si dependiera de un sitio externo, una caída ajena
  // haría que Render marque nuestra app como no saludable
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memoria_heap', LIMITE_HEAP_BYTES),
    ]);
  }
}
