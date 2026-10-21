import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './tarea.entity';

// Persistencia en memoria: la lógica de negocio no es el foco del TP
@Injectable()
export class TareasService {
  private tareas: Tarea[] = [];
  private siguienteId = 1;

  findAll(): Tarea[] {
    return this.tareas;
  }

  findOne(id: number): Tarea {
    const tarea = this.tareas.find((t) => t.id === id);
    if (!tarea) {
      throw new NotFoundException(`No existe la tarea ${id}`);
    }
    return tarea;
  }

  create(dto: CreateTareaDto): Tarea {
    const tarea: Tarea = {
      id: this.siguienteId++,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      completada: false,
      creadaEn: new Date().toISOString(),
    };
    this.tareas.push(tarea);
    return tarea;
  }

  update(id: number, dto: UpdateTareaDto): Tarea {
    const tarea = this.findOne(id);
    Object.assign(tarea, dto);
    return tarea;
  }

  remove(id: number): void {
    this.findOne(id);
    this.tareas = this.tareas.filter((t) => t.id !== id);
  }
}
