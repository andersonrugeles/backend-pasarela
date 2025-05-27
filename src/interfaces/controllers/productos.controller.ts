import { Controller, Get, Injectable } from '@nestjs/common';
import { GetProductosUseCase } from '../../application/use-cases/obtener-productos-usecase';
import { ProductoDynamoAdapter } from '../../adapters/outbound/producto-dynamo.adapter';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductoDto } from '../dtos/producto.dto';

@ApiTags('Productos')
@Controller('productos')
@Injectable()
export class ProductosController {

  constructor(private readonly getProductosUseCase: GetProductosUseCase) {

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
