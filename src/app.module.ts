import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { ProductosController } from './interfaces/controllers/productos.controller';
import { CompraController } from './interfaces/controllers/compra.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController, ProductosController, CompraController],
  providers: [AppService],
})
export class AppModule {}
