import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('info')
@Controller('info')
export class InfoController {
  @Get()
  @ApiOkResponse({ description: 'Versión y entorno que está corriendo' })
  info() {
    return {
      app: 'tp-devops-api',
      version: process.env.APP_VERSION ?? 'dev',
      env: process.env.APP_ENV ?? 'local',
    };
  }
}
