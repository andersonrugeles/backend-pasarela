import { Producto } from '../models/producto.model';

export interface ProductoRepository {
  findAll(): Promise<Producto[]>;
  obtenerPorId(id: string): Promise<Producto | null>;
  actualizar(producto: Producto): Promise<Producto>;
}