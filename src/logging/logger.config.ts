import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Params } from 'nestjs-pino';
import pino from 'pino';
import { pinoLoki, type LokiOptions } from 'pino-loki';

const nivel = (process.env.LOG_LEVEL ?? 'info') as pino.Level;

function datosRequest(req: IncomingMessage, res: ServerResponse) {
  return {
    method: req.method,
    path: (req.url ?? '').split('?')[0],
    status_code: res.statusCode,
  };
}

// stdout siempre; Loki solo si están las credenciales de Grafana Cloud
function destino() {
  const streams: pino.StreamEntry[] = [
    { level: nivel, stream: process.stdout },
  ];

  if (process.env.LOKI_HOST) {
    streams.push({
      level: nivel,
      stream: pinoLoki({
        host: process.env.LOKI_HOST,
        basicAuth: {
          username: process.env.LOKI_USER ?? '',
          password: process.env.LOKI_TOKEN ?? '',
        },
        labels: {
          app: 'tp-devops-api',
          env: process.env.APP_ENV ?? 'local',
        },
        // el level sale como texto ("info"), no como número
        levelMap: {
          debug: 'debug',
          info: 'info',
          warn: 'warning',
          error: 'error',
          fatal: 'critical',
        } as unknown as LokiOptions['levelMap'],
        batching: { interval: 5 },
        silenceErrors: true,
      }),
    });
  }

  return pino.multistream(streams);
}

export function loggerConfig(): Params {
  return {
    pinoHttp: [
      {
        level: nivel,
        messageKey: 'message',
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        formatters: {
          level: (label) => ({ level: label }),
        },
        base: {
          app: 'tp-devops-api',
          env: process.env.APP_ENV ?? 'local',
          version: process.env.APP_VERSION ?? 'dev',
        },
        quietReqLogger: true,
        // los headers no van al log (pueden traer tokens)
        serializers: { req: () => undefined, res: () => undefined },
        autoLogging: {
          ignore: (req) => req.url === '/metrics',
        },
        customLogLevel: (_req, res, err) => {
          if (err || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        customSuccessMessage: (req, res) =>
          `${req.method} ${req.url} ${res.statusCode}`,
        customErrorMessage: (req, res) =>
          `${req.method} ${req.url} ${res.statusCode}`,
        customSuccessObject: (req, res, val: { responseTime: number }) => ({
          ...datosRequest(req, res),
          duration_ms: val.responseTime,
        }),
        customErrorObject: (req, res, err, val: { responseTime: number }) => ({
          ...datosRequest(req, res),
          duration_ms: val.responseTime,
          error: err.message,
        }),
      },
      destino(),
    ],
  };
}
