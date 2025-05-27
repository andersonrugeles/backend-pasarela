import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CompraEstado } from '../../domain/models/compra-status.enum';

export class ActualizarCompraDto {
  @ApiPropertyOptional({ enum: CompraEstado })
  @IsEnum(CompraEstado)
  @IsOptional()
  estado: CompraEstado;

  @ApiProperty({ example: 'Jesus', description: 'Nombre del comprador' })
  @IsString()
  @IsOptional()

  nombreCliente?: string;

  @ApiProperty({ example: 'Calle prueba', description: 'Direccion del comprador' })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({ example: 1200, description: 'Total de la compra' })
  @IsInt()
  @Min(1)
  @IsOptional()
  total?: number;

  @ApiProperty({ example: '1', description: 'Cantidad de la compra' })
  @IsInt()
  @Min(0)
  @IsOptional()
  cantidad?: number;
}
