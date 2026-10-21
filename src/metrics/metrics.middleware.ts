import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const inicio = process.hrtime.bigint();

    res.on('finish', () => {
      // Usamos el patrón de la ruta (/tareas/:id) para no explotar la cardinalidad.
      // Las rutas que no existen las atrapa el comodín de Nest ({/*splat}):
      // las agrupamos todas en un único label legible
      const patron = req.route
        ? `${req.baseUrl}${(req.route as { path: string }).path}`
        : '';
      const route = !patron || patron.includes('*') ? 'no_encontrada' : patron;
      if (route === '/metrics') return;

      const segundos = Number(process.hrtime.bigint() - inicio) / 1e9;
      this.metrics.observe(req.method, route, res.statusCode, segundos);
    });

    next();
  }
}
