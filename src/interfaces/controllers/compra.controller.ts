import { Controller, Post, Body, HttpException, HttpStatus, Patch, Param } from '@nestjs/common';
import { CrearTransaccionUseCase } from '../../application/use-cases/completar-transaccion.usecase';
import { CompraDynamoAdapter } from '../../adapters/outbound/compra-dynamo.adapter';
import { Result } from '../../shared/result';
import { ActualizarTransaccionUseCase } from 'src/application/use-cases/actualizar-transaccion.usecase';
import { ProductoDynamoAdapter } from 'src/adapters/outbound/producto-dynamo.adapter';
import { CompraEstado } from 'src/domain/models/compra-status.enum';

interface CrearCompraDto {
    productoId: string;
    cantidad: number;
    nombreCliente: string;
    direccion: string;
    total: number;
}

interface ActualizarCompraDto {
    estado: CompraEstado;
    nombreCliente?: string;
    direccion?: string;
    total?: number;
    cantidad?: number;
}

@Controller('compra')
export class CompraController {
    private crearTransaccionUseCase = new CrearTransaccionUseCase(new CompraDynamoAdapter());
    private actualizarTransaccionUseCase = new ActualizarTransaccionUseCase(
        new CompraDynamoAdapter(),
        new ProductoDynamoAdapter(),
    );

    @Post()
    async crearCompra(@Body() dto: CrearCompraDto) {
        const result: Result<any, Error> = await this.crearTransaccionUseCase.execute(dto);
        if (result.isErr()) {
            console.log('Error en la compra',result.error)
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        return result.value;
    }

    @Patch(':id')
    async actualizarCompra(@Param('id') id: string, @Body() dto: ActualizarCompraDto) {
        const result: Result<any, Error> = await this.actualizarTransaccionUseCase.execute({ id, ...dto });
        if (result.isErr()) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        return result.value;
    }
}
