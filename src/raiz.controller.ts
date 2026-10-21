import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

// La raíz no tiene contenido propio: mandamos a la documentación interactiva
@ApiExcludeController()
@Controller()
export class RaizController {
  @Get()
  @Redirect('/docs', 302)
  raiz() {}
}
