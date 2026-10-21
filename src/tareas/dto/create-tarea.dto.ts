import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({ example: 'Configurar pipeline de CI' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo: string;

  @ApiProperty({ example: 'Agregar lint y tests al workflow', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
