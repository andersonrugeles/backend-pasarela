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
import { CLIENTE_REPOSITORY, COMPRA_REPOSITORY, ENTREGA_REPOSITORY, PRODUCTO_REPOSITORY } from './common/tokens';
import { CompraDynamoAdapter } from './adapters/outbound/compra-dynamo.adapter';
import { CrearClienteUseCase } from './application/use-cases/crear-cliente.usecase';
import { ClienteDynamoAdapter } from './adapters/outbound/cliente-dynamo.adapter';
import { EntregaDynamoAdapter } from './adapters/outbound/entrega-dynamo.adapter';

@Module({
  imports: [],
  controllers: [AppController, HealthController, ProductosController, CompraController],
  providers: [
    AppService,
    GetProductosUseCase,
    {
      provide: PRODUCTO_REPOSITORY,
      useClass: ProductoDynamoAdapter
    },
    {
      provide: COMPRA_REPOSITORY,
      useClass: CompraDynamoAdapter
    },
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteDynamoAdapter
    },
    {
      provide: ENTREGA_REPOSITORY,
      useClass: EntregaDynamoAdapter
    },
    CrearClienteUseCase,
    ActualizarTransaccionUseCase,
    CrearTransaccionUseCase
  ],
  exports: [GetProductosUseCase],
})
export class AppModule { }
