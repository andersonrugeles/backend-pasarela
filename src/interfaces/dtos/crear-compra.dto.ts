import { ApiProperty } from '@nestjs/swagger';

export class CompraDto {
    @ApiProperty({ example: '1', description: 'Identificador único del producto' })
    productoId: string;

    @ApiProperty({ example: '1', description: 'Cantidad de la compra' })
    cantidad: number;

    @ApiProperty({ example: 'Jesus', description: 'Nombre del comprador' })
    nombreCliente: string;

    @ApiProperty({ example: 'Calle prueba', description: 'Direccion del comprador' })
    direccion: string;

    @ApiProperty({ example: 1200, description: 'Total de la compra' })
    total: number;
}
