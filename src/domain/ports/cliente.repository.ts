import { Cliente } from '../models/cliente.model';

export interface ClienteRepository {
  buscarPorEmail(email: string): Promise<Cliente | null>;
  crear(cliente: Cliente): Promise<Cliente>;
}