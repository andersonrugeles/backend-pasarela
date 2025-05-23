import { Controller, Post, Body, HttpException, HttpStatus, Patch, Param } from '@nestjs/common';
import { CrearTransaccionUseCase } from '../../application/use-cases/completar-transaccion.usecase';
import { CompraDynamoAdapter } from '../../adapters/outbound/compra-dynamo.adapter';
import { Result } from '../../shared/result';
import { ActualizarTransaccionUseCase } from 'src/application/use-cases/actualizar-transaccion.usecase';
import { ProductoDynamoAdapter } from 'src/adapters/outbound/producto-dynamo.adapter';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrearCompraDto } from '../dtos/crear-compra.dto';
import { ActualizarCompraDto } from '../dtos/actualizar-compra.dto';
import { CrearClienteUseCase } from 'src/application/use-cases/crear-cliente.usecase';
import { ClienteDynamoAdapter } from 'src/adapters/outbound/cliente-dynamo.adapter';
import { EntregaDynamoAdapter } from 'src/adapters/outbound/entrega-dynamo.adapter';


@ApiTags('Compras')
@Controller('compra')
export class CompraController {
    private crearTransaccionUseCase = new CrearTransaccionUseCase(new CompraDynamoAdapter(), new ProductoDynamoAdapter(), new CrearClienteUseCase(new ClienteDynamoAdapter));
    private actualizarTransaccionUseCase = new ActualizarTransaccionUseCase(
        new CompraDynamoAdapter(),
        new ProductoDynamoAdapter(),
        new EntregaDynamoAdapter()
    );

    @Post()
    @ApiBody({ type: CrearCompraDto })
    @ApiOperation({ summary: 'Crear una nueva compra' })
    async crearCompra(@Body() dto: CrearCompraDto) {
        const result: Result<any, Error> = await this.crearTransaccionUseCase.execute(dto);
        if (result.isErr()) {
            console.log('Error en la compra', result.error)
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        return result.value;
    }

    @Patch(':id')
    @ApiBody({ type: ActualizarCompraDto })
    @ApiOperation({ summary: 'Actualizar una compra' })
    async actualizarCompra(@Param('id') id: string, @Body() dto: ActualizarCompraDto) {
        const result: Result<any, Error> = await this.actualizarTransaccionUseCase.execute({ id, ...dto });
        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        return result.value;
    }
}
