import { Entrega } from '../../domain/models/entrega.model';

export interface EntregaRepository {
  guardar(entrega: Entrega): Promise<void>;
}
