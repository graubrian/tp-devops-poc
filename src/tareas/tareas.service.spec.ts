import { NotFoundException } from '@nestjs/common';
import { TareasService } from './tareas.service';

describe('TareasService', () => {
  let service: TareasService;

  beforeEach(() => {
    service = new TareasService();
  });

  it('arranca sin tareas', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('crea una tarea pendiente con id incremental', () => {
    const t1 = service.create({ titulo: 'Primera' });
    const t2 = service.create({ titulo: 'Segunda' });

    expect(t1.id).toBe(1);
    expect(t2.id).toBe(2);
    expect(t1.completada).toBe(false);
    expect(service.findAll()).toHaveLength(2);
  });

  it('busca una tarea por id', () => {
    const creada = service.create({ titulo: 'Buscar' });
    expect(service.findOne(creada.id)).toEqual(creada);
  });

  it('tira 404 si la tarea no existe', () => {
    expect(() => service.findOne(42)).toThrow(NotFoundException);
  });

  it('actualiza una tarea', () => {
    const creada = service.create({ titulo: 'Original' });
    const actualizada = service.update(creada.id, { completada: true });

    expect(actualizada.completada).toBe(true);
    expect(actualizada.titulo).toBe('Original');
  });

  it('borra una tarea', () => {
    const creada = service.create({ titulo: 'Borrar' });
    service.remove(creada.id);

    expect(service.findAll()).toHaveLength(0);
    expect(() => service.remove(creada.id)).toThrow(NotFoundException);
  });
});
