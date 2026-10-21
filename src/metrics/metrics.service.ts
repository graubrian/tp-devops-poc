import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  // Tráfico y errores: rate() sobre el counter, filtrando por status_code
  readonly requestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total de requests HTTP recibidas',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });

  // Latencia: histogram_quantile() para p50 / p95 / p99
  readonly requestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duración de las requests HTTP en segundos',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [this.registry],
  });

  constructor() {
    this.registry.setDefaultLabels({
      app: 'tp-devops-api',
      env: process.env.APP_ENV ?? 'local',
      version: process.env.APP_VERSION ?? 'dev',
    });
    // CPU, memoria y event loop (saturación)
    collectDefaultMetrics({ register: this.registry });
  }

  observe(method: string, route: string, statusCode: number, seconds: number) {
    const labels = { method, route, status_code: String(statusCode) };
    this.requestsTotal.inc(labels);
    this.requestDuration.observe(labels, seconds);
  }
}
