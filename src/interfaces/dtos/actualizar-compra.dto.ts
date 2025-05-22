import { ApiProperty } from '@nestjs/swagger';

export class CompraActualizarDto {
  @ApiProperty()
  estado: 'PENDIENTE' | 'EXITOSA' | 'FALLIDA';

  @ApiProperty({ example: 'Jesus', description: 'Nombre del comprador' })
  nombreCliente?: string;

  @ApiProperty({ example: 'Calle prueba', description: 'Direccion del comprador' })
  direccion?: string;

  @ApiProperty({ example: 1200, description: 'Total de la compra' })
  total?: number;

  @ApiProperty({ example: '1', description: 'Cantidad de la compra' })
  cantidad?: number;
}
