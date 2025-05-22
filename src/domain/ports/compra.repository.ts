import { Compra } from '../models/compra-status.enum';

export interface CompraRepository {
  crear(compra: Compra): Promise<Compra>;
  actualizar(compra: Compra): Promise<Compra>;
  obtenerPorId(id: string): Promise<Compra | null>;
}