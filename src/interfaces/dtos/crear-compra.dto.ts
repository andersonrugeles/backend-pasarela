import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CrearCompraDto {
    @ApiProperty({ example: '1', description: 'Identificador único del producto' })
    @IsUUID()
    @IsNotEmpty()
    productoId: string;

    @ApiProperty({ example: '1', description: 'Cantidad de la compra' })
    @IsInt()
    @Min(1)
    cantidad: number;

    @ApiProperty({ example: 'Jesus', description: 'Nombre del comprador' })
    @IsString()
    @IsNotEmpty()
    nombreCliente: string;

    @ApiProperty({ example: '328199434', description: 'Telefono del comprador' })
    @IsString()
    @IsNotEmpty()
    telefono: string;


    @ApiProperty({ example: 'jesus@gmail.com', description: 'Email del comprador' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Calle prueba', description: 'Direccion del comprador' })
    @IsString()
    @IsNotEmpty()
    direccion: string;

    @ApiProperty({ example: 1200, description: 'Total de la compra' })
    @IsNotEmpty()
    @Min(1)
    total: number;
}
