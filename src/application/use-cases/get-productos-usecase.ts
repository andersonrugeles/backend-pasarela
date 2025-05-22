import { ProductoRepository } from '../../domain/ports/productos.repository';
import { Producto } from '../../domain/models/producto.model';
import { Result, ok, err } from '../../shared/result';

export class GetProductosUseCase {
  constructor(private readonly productoRepo: ProductoRepository) {}

  async execute(): Promise<Result<Producto[], Error>> {
    try {
      const productos = await this.productoRepo.findAll();
      return ok(productos);
    } catch (e) {
      return err(new Error('Error al obtener productos'));
    }
  }
}
