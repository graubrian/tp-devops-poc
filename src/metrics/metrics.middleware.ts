import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const inicio = process.hrtime.bigint();

    res.on('finish', () => {
      // Usamos el patrón de la ruta (/tareas/:id) para no explotar la cardinalidad
      const route = req.route
        ? `${req.baseUrl}${(req.route as { path: string }).path}`
        : 'no_encontrada';
      if (route === '/metrics') return;

      const segundos = Number(process.hrtime.bigint() - inicio) / 1e9;
      this.metrics.observe(req.method, route, res.statusCode, segundos);
    });

    next();
  }
}
