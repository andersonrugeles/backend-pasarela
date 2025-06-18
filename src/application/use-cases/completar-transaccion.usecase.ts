import { ProductoRepository } from 'src/domain/ports/productos.repository';
import { Compra, CompraEstado } from '../../domain/models/compra-status.enum';
import { CompraRepository } from '../../domain/ports/compra.repository';
import { Result, ok, err } from '../../shared/result';
import { CrearClienteUseCase } from './crear-cliente.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { CLIENTE_REPOSITORY, COMPRA_REPOSITORY, PRODUCTO_REPOSITORY } from 'src/common/tokens';

interface CrearTransaccionDTO {
  productoId: string;
  cantidad: number;
  nombreCliente: string;
  direccion: string;
  telefono:string;
  email:string
  total: number;
}
@Injectable()
export class CrearTransaccionUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
    @Inject(COMPRA_REPOSITORY)
    private compraRepo: CompraRepository,
    private readonly crearCliente: CrearClienteUseCase
  ) { }

  async execute(data: CrearTransaccionDTO): Promise<Result<Compra, Error>> {
    try {
      const producto = await this.productoRepository.obtenerPorId(data.productoId);
      if (!producto) {
        return err(new Error('Producto no encontrado'));
      }

      if (producto.stock < data.cantidad) {
        return err(new Error('Stock insuficiente'));
      }

      const clienteResult = await this.crearCliente.execute({
        nombre: data.nombreCliente,
        email: data.email,
        direccion: data.direccion,
        telefono: data.telefono
      });

      if (clienteResult.isErr()) {
        return err(clienteResult.error);
      }
      const compra: Compra = {
        id: '',
        productoId: data.productoId,
        cantidad: data.cantidad,
        estado: CompraEstado.PENDIENTE,
        nombreCliente: data.nombreCliente,
        direccion: data.direccion,
        total: producto.precio * data.cantidad,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      const compraCreada = await this.compraRepo.crear(compra);
      return ok(compraCreada);
    } catch (error) {
      console.log('Ha ocurrido un error', JSON.stringify(error))
      return err(new Error('Error creando la transacción'));
    }
  }
}
