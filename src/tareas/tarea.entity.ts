import { ApiProperty } from '@nestjs/swagger';

export class Tarea {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Configurar pipeline de CI' })
  titulo: string;

  @ApiProperty({ example: 'Agregar lint y tests al workflow', required: false })
  descripcion?: string;

  @ApiProperty({ example: false })
  completada: boolean;

  @ApiProperty({ example: '2026-10-20T12:00:00.000Z' })
  creadaEn: string;
}
