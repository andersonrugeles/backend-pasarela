import { Producto } from '../models/producto.model';

export interface ProductoRepository {
  findAll(): Promise<Producto[]>;
}