// interfaces/controllers/productos.controller.ts
import { Controller, Get } from '@nestjs/common';
import { GetProductosUseCase } from '../../application/use-cases/obtener-productos-usecase';
import { ProductoDynamoAdapter } from '../../adapters/outbound/producto-dynamo.adapter';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductoDto } from '../dtos/producto.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  private readonly getProductosUseCase: GetProductosUseCase;

  constructor() {
    const productoRepo = new ProductoDynamoAdapter();
    this.getProductosUseCase = new GetProductosUseCase(productoRepo);
  }

  @Get()
  @ApiBody({ type: ProductoDto })
  @ApiOperation({ summary: 'Obtener lista de productos disponibles' })
  async obtenerProductos() {
    const result = await this.getProductosUseCase.execute();
    if (result.isErr()) {
      return { error: result.error.message };
    }
    return result.value;
  }
}
