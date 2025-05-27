import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { ProductosController } from './interfaces/controllers/productos.controller';
import { CompraController } from './interfaces/controllers/compra.controller';
import { GetProductosUseCase } from './application/use-cases/obtener-productos.usecase';
import { ProductoDynamoAdapter } from './adapters/outbound/producto-dynamo.adapter';
import { ActualizarTransaccionUseCase } from './application/use-cases/actualizar-transaccion.usecase';
import { CrearTransaccionUseCase } from './application/use-cases/completar-transaccion.usecase';

@Module({
  imports: [],
  controllers: [AppController, HealthController, ProductosController, CompraController],
  providers: [AppService,GetProductosUseCase,ProductoDynamoAdapter,ActualizarTransaccionUseCase,CrearTransaccionUseCase],
  exports:[GetProductosUseCase]
})
export class AppModule {}
