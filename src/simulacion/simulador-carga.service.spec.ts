import { SimuladorCargaService } from './simulador-carga.service';

describe('SimuladorCargaService', () => {
  const service = new SimuladorCargaService();

  afterEach(() => {
    delete process.env.SIMULADOR_ACTIVO;
    jest.restoreAllMocks();
  });

  it('siempre genera al menos una request', () => {
    for (let i = 0; i < 200; i++) {
      expect(service.cantidadDeRequests(i * 15_000)).toBeGreaterThanOrEqual(1);
    }
  });

  it('no hace nada si el simulador está apagado', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    await service.tick();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
