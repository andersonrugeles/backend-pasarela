import { Controller, Get } from '@nestjs/common';

@Controller('salud')
export class HealthController {
  @Get()
  check() {
    return {
      estado: 'ok',
      mensaje: 'API funcionando correctamente ✅',
      fecha: new Date().toISOString(),
    };
  }
}