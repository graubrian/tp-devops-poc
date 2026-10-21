import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './tarea.entity';
import { TareasService } from './tareas.service';

@ApiTags('tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @ApiOkResponse({ type: [Tarea] })
  findAll(): Tarea[] {
    return this.tareasService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Tarea })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number): Tarea {
    return this.tareasService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Tarea })
  create(@Body() dto: CreateTareaDto): Tarea {
    return this.tareasService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Tarea })
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTareaDto,
  ): Tarea {
    return this.tareasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.tareasService.remove(id);
  }
}
