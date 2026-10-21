import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configurarApp } from '../src/setup';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health responde ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          status: string;
          info: Record<string, { status: string }>;
        };
        expect(body.status).toBe('ok');
        expect(body.info.memoria_heap.status).toBe('up');
      });
  });

  it('redirige la raíz a la documentación', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Location', '/docs');
  });

  it('expone la documentación de Swagger', async () => {
    await request(app.getHttpServer()).get('/docs').expect(200);
    const res = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    expect((res.body as { paths: object }).paths).toHaveProperty('/tareas');
  });

  it('crea y lista tareas', async () => {
    const creada = await request(app.getHttpServer())
      .post('/tareas')
      .send({ titulo: 'Desde e2e' })
      .expect(201);

    const lista = await request(app.getHttpServer()).get('/tareas').expect(200);
    expect(lista.body).toContainEqual(creada.body);
  });

  it('valida el body con 400', () => {
    return request(app.getHttpServer())
      .post('/tareas')
      .send({ titulo: '' })
      .expect(400);
  });

  it('devuelve 404 si la tarea no existe', () => {
    return request(app.getHttpServer()).get('/tareas/9999').expect(404);
  });

  it('expone métricas de Prometheus por ruta', async () => {
    await request(app.getHttpServer()).get('/tareas/9999');
    const res = await request(app.getHttpServer()).get('/metrics').expect(200);

    expect(res.text).toContain('http_requests_total');
    expect(res.text).toContain('route="/tareas/:id"');
    expect(res.text).toContain('status_code="404"');
    expect(res.text).toContain('http_request_duration_seconds_bucket');
  });
});
