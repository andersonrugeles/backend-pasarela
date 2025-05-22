// interfaces/controllers/productos.controller.ts
import { Controller, Get } from '@nestjs/common';
import { GetProductosUseCase } from '../../application/use-cases/get-productos-usecase';
import { ProductoDynamoAdapter } from '../../adapters/outbound/producto-dynamo.adapter';

@Controller('productos')
export class ProductosController {
  private readonly getProductosUseCase: GetProductosUseCase;

  constructor() {
    const productoRepo = new ProductoDynamoAdapter();
    this.getProductosUseCase = new GetProductosUseCase(productoRepo);
  }

  @Get()
  async obtenerProductos() {
    const result = await this.getProductosUseCase.execute();
    if (result.isErr()) {
      return { error: result.error.message };
    }
    return result.value;
  }
}
