import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'La API está levantada' })
  check() {
    return {
      status: 'ok',
      version: process.env.APP_VERSION ?? 'dev',
      uptime: Math.round(process.uptime()),
    };
  }
}
