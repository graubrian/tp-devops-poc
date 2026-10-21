import {
  Controller,
  Get,
  Headers,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { MetricsService } from './metrics.service';

@ApiExcludeController()
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async scrape(
    @Headers('authorization') authorization: string | undefined,
    @Res() res: Response,
  ) {
    // Si hay token configurado, Grafana Cloud lo manda como Bearer al scrapear
    const token = process.env.METRICS_TOKEN;
    if (token && authorization !== `Bearer ${token}`) {
      throw new UnauthorizedException();
    }

    res.set('Content-Type', this.metrics.registry.contentType);
    res.send(await this.metrics.registry.metrics());
  }
}
