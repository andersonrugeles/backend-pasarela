import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { ProductosController } from './interfaces/controllers/productos.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController, ProductosController],
  providers: [AppService],
})
export class AppModule {}
