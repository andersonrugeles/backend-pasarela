import { EntregaRepository } from '../../domain/ports/entrega.repository';
import { Entrega } from '../../domain/models/entrega.model';
import { Result, ok, err } from '../../shared/result';
import { randomUUID } from 'crypto';

export class CrearEntregaUseCase {
  constructor(private readonly repo: EntregaRepository) {}

  async execute(data: Omit<Entrega, 'id' | 'estado'>): Promise<Result<Entrega, Error>> {
    const entrega: Entrega = {
      id: randomUUID(),
      estado: 'PENDIENTE',
      ...data,
    };

    try {
      await this.repo.guardar(entrega);
      return ok(entrega);
    } catch (e) {
      return err(new Error('No se pudo guardar la entrega'));
    }
  }
}
