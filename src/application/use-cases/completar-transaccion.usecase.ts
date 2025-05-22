import { Compra, CompraEstado } from '../../domain/models/compra-status.enum';
import { CompraRepository } from '../../domain/ports/compra.repository';
import { Result, ok, err } from '../../shared/result';

interface CrearTransaccionDTO {
  productoId: string;
  cantidad: number;
  nombreCliente: string;
  direccion: string;
  total: number;
}

export class CrearTransaccionUseCase {
  constructor(private compraRepo: CompraRepository) {}

  async execute(data: CrearTransaccionDTO): Promise<Result<Compra, Error>> {
    try {
      const compra: Compra = {
        id: '',
        productoId: data.productoId,
        cantidad: data.cantidad,
        estado: CompraEstado.PENDIENTE,
        nombreCliente: data.nombreCliente,
        direccion: data.direccion,
        total: data.total,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      const compraCreada = await this.compraRepo.crear(compra);
      return ok(compraCreada);
    } catch (error) {
      console.log('Ha ocurrido un error',JSON.stringify(error))
      return err(new Error('Error creando la transacción'));
    }
  }
}
