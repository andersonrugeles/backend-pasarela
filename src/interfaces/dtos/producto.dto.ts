import { ApiProperty } from "@nestjs/swagger";

export class ProductoDto {
  @ApiProperty({ example: '1', description: 'Identificador único del producto' })
  id: string;

  @ApiProperty({ example: 'Camiseta', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ example: 'Camiseta de algodón 100%', description: 'Descripción del producto' })
  descripcion: string;

  @ApiProperty({ example: 49.99, description: 'Precio del producto en USD' })
  precio: number;

  @ApiProperty({ example: 10, description: 'Cantidad disponible en stock' })
  stock: number;

  @ApiProperty({ example: 'https://example.com/imagen.jpg', description: 'URL de la imagen del producto' })
  imagenUrl: string;
}