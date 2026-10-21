import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

const INTERVALO_MS = 5000;

type Accion = { peso: number; ejecutar: () => Promise<unknown> };

// Genera tráfico sintético contra la propia API para que el dashboard
// tenga datos variables (tráfico, latencia y errores) durante la demo
@Injectable()
export class SimuladorCargaService {
  private readonly logger = new Logger(SimuladorCargaService.name);
  private readonly baseUrl = `http://127.0.0.1:${process.env.PORT ?? 3000}`;
  private ids: number[] = [];

  private get activo() {
    return process.env.SIMULADOR_ACTIVO === 'true';
  }

  @Interval(INTERVALO_MS)
  async tick() {
    if (!this.activo) return;

    const cantidad = this.cantidadDeRequests();
    this.logger.debug(`Simulando ${cantidad} requests`);

    const requests = Array.from({ length: cantidad }, async () => {
      // repartimos las requests dentro de la ventana para que no lleguen todas juntas
      await new Promise((r) => setTimeout(r, Math.random() * INTERVALO_MS));
      await this.elegirAccion().ejecutar();
    });
    await Promise.allSettled(requests);
  }

  // Onda de ~10 minutos + ruido + picos ocasionales, como una app real
  cantidadDeRequests(ahora = Date.now()): number {
    const onda = Math.sin((ahora / 600_000) * 2 * Math.PI);
    const base = 12 + onda * 8;
    const ruido = Math.random() * 4 - 2;
    const pico = Math.random() < 0.05 ? 3 : 1;
    return Math.max(1, Math.round((base + ruido) * pico));
  }

  private elegirAccion(): Accion {
    const acciones: Accion[] = [
      { peso: 35, ejecutar: () => this.llamar('GET', '/tareas') },
      {
        peso: 15,
        ejecutar: () => this.llamar('GET', `/tareas/${this.idAlAzar()}`),
      },
      { peso: 5, ejecutar: () => this.llamar('GET', '/tareas/99999') },
      { peso: 15, ejecutar: () => this.crearTarea() },
      {
        peso: 4,
        ejecutar: () => this.llamar('POST', '/tareas', { titulo: '' }),
      },
      {
        peso: 6,
        ejecutar: () =>
          this.llamar('PATCH', `/tareas/${this.idAlAzar()}`, {
            completada: true,
          }),
      },
      { peso: 8, ejecutar: () => this.borrarTarea() },
      { peso: 12, ejecutar: () => this.llamar('GET', '/simulacion/inestable') },
    ];

    const total = acciones.reduce((acc, a) => acc + a.peso, 0);
    let r = Math.random() * total;
    for (const accion of acciones) {
      r -= accion.peso;
      if (r <= 0) return accion;
    }
    return acciones[0];
  }

  private idAlAzar(): number {
    if (this.ids.length === 0) return 1;
    return this.ids[Math.floor(Math.random() * this.ids.length)];
  }

  private async crearTarea() {
    const res = await this.llamar('POST', '/tareas', {
      titulo: `Tarea simulada ${Math.floor(Math.random() * 1000)}`,
    });
    if (res?.ok) {
      const tarea = (await res.json()) as { id: number };
      this.ids.push(tarea.id);
    }
  }

  private async borrarTarea() {
    if (this.ids.length === 0) return;
    const id = this.ids.shift()!;
    await this.llamar('DELETE', `/tareas/${id}`);
  }

  private async llamar(metodo: string, path: string, body?: unknown) {
    try {
      return await fetch(`${this.baseUrl}${path}`, {
        method: metodo,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      this.logger.warn(`Falló la request simulada a ${path}: ${String(err)}`);
      return undefined;
    }
  }
}
