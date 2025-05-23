import { CompraRepository } from '../../domain/ports/compra.repository';
import { ProductoRepository } from '../../domain/ports/productos.repository';
import { Compra, CompraEstado } from '../../domain/models/compra-status.enum';
import { Result, ok, err } from '../../shared/result';
import { EntregaRepository } from 'src/domain/ports/entrega.repository';
import { randomUUID } from 'crypto';
import { Entrega } from 'src/domain/models/entrega.model';

interface ActualizarTransaccionDTO {
  id: string;
  estado: CompraEstado;
  nombreCliente?: string;
  direccion?: string;
  total?: number;
  cantidad?: number;
}

export class ActualizarTransaccionUseCase {
  constructor(
    private compraRepo: CompraRepository,
    private productoRepo: ProductoRepository,
    private entregaRepository: EntregaRepository
  ) { }

  async execute(data: ActualizarTransaccionDTO): Promise<Result<Compra, Error>> {
    try {
      const compra = await this.compraRepo.obtenerPorId(data.id);
      if (!compra) return err(new Error('Compra no encontrada'));

      compra.estado = data.estado;
      if (data.nombreCliente) compra.nombreCliente = data.nombreCliente;
      if (data.direccion) compra.direccion = data.direccion;
      if (data.total !== undefined) compra.total = data.total;

      if (data.estado === CompraEstado.EXITOSA) {
        const entrega: Entrega = {
          id: randomUUID(),
          compraId: compra.id,
          direccion: compra.direccion,
          estado: 'PENDIENTE',
          fechaEntrega: new Date().toISOString()
        };


        const producto = await this.productoRepo.obtenerPorId(compra.productoId);
        if (!producto) return err(new Error('Producto no encontrado'));
        if (!data.cantidad || producto.stock < data.cantidad) {
          return err(new Error('Stock insuficiente o cantidad no especificada'));
        }

        producto.stock -= data.cantidad;
        await this.productoRepo.actualizar(producto);
        await this.entregaRepository.guardar(entrega);
        compra.cantidad = data.cantidad;
      }

      compra.fechaActualizacion = new Date().toISOString();
      const compraActualizada = await this.compraRepo.actualizar(compra);
      return ok(compraActualizada);
    } catch (error) {
      return err(new Error('Error actualizando la transacción'));
    }
  }
}
