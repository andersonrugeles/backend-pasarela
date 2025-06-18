import { Controller, Post, Body, HttpException, HttpStatus, Patch, Param, Injectable } from '@nestjs/common';
import { CrearTransaccionUseCase } from '../../application/use-cases/completar-transaccion.usecase';
import { Result } from '../../shared/result';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrearCompraDto } from '../dtos/crear-compra.dto';
import { ActualizarCompraDto } from '../dtos/actualizar-compra.dto';
import { ActualizarTransaccionUseCase } from 'src/application/use-cases/actualizar-transaccion.usecase';


@ApiTags('Compras')
@Controller('compra')
@Injectable()
export class CompraController {

    constructor(
        private readonly crearTransaccionUseCase: CrearTransaccionUseCase,
        private readonly actualizarTransaccionUseCase: ActualizarTransaccionUseCase
    ) {

    }


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
