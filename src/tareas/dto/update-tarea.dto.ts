import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTareaDto } from './create-tarea.dto';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
