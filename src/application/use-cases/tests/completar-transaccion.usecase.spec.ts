import { CrearTransaccionUseCase } from '../completar-transaccion.usecase';
import { CompraRepository } from '../../../domain/ports/compra.repository';
import { ProductoRepository } from '../../../domain/ports/productos.repository';
import { CrearClienteUseCase } from '../crear-cliente.usecase';
import { CompraEstado } from '../../../domain/models/compra-status.enum';
import { ok, err } from '../../../shared/result';

const mockCompraRepo = {
  crear:jest.fn(),
  obtenerPorId: jest.fn(),
  actualizar: jest.fn(),
};

const mockProductoRepo = {
  findAll:jest.fn(),
  obtenerPorId: jest.fn(),
  actualizar: jest.fn(),
};

const mockCrearCliente = {
    execute: jest.fn(),
} as unknown as jest.Mocked<CrearClienteUseCase>;

describe('CrearTransaccionUseCase', () => {
  let useCase: CrearTransaccionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CrearTransaccionUseCase(
      mockCompraRepo,
      mockProductoRepo,
      mockCrearCliente
    );
  });

  it('debería retornar error si el producto no existe', async () => {
    mockProductoRepo.obtenerPorId.mockResolvedValue(null);

    const result = await useCase.execute({
      productoId: 'p1',
      cantidad: 2,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'juan@test.com',
      total: 0,
    });

    expect(result.isErr()).toBe(true);

  });

  it('debería retornar error si el stock es insuficiente', async () => {
    mockProductoRepo.obtenerPorId.mockResolvedValue({
      id: 'p1',
      stock: 1,
    });

    const result = await useCase.execute({
      productoId: 'p1',
      cantidad: 2,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'juan@test.com',
      total: 0,
    });

    expect(result.isErr()).toBe(true);
  });

  it('debería retornar error si la creación del cliente falla', async () => {
    mockProductoRepo.obtenerPorId.mockResolvedValue({
      id: 'p1',
      stock: 10,
      precio: 100,
    });

    mockCrearCliente.execute.mockResolvedValue(err(new Error('Error creando cliente')));

    const result = await useCase.execute({
      productoId: 'p1',
      cantidad: 1,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'juan@test.com',
      total: 100,
    });

    expect(result.isErr()).toBe(true);
  });

  it('debería crear la transacción exitosamente', async () => {
    const producto = {
      id: 'p1',
      stock: 10,
      precio: 100,
    };

    mockProductoRepo.obtenerPorId.mockResolvedValue(producto);
      mockCrearCliente.execute.mockResolvedValue(ok({
          id: 'cliente-id',
          nombre: 'pueba',
          email: 'prueba@gmail.com',
          telefono: '34234',
          direccion: 'prueba',
          fechaCreacion: new Date().toISOString()
      }));
    mockCompraRepo.crear.mockResolvedValue({
      id: 'compra-id',
      productoId: 'p1',
      cantidad: 2,
      estado: CompraEstado.PENDIENTE,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      total: 200,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });

    const result = await useCase.execute({
      productoId: 'p1',
      cantidad: 2,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'juan@test.com',
      total: 200,
    });

    expect(result.isOk()).toBe(true);
    expect(mockCompraRepo.crear).toHaveBeenCalledWith(expect.objectContaining({
      productoId: 'p1',
      cantidad: 2,
      total: 200,
      estado: CompraEstado.PENDIENTE,
    }));
  });

  it('debería retornar error si ocurre una excepción', async () => {
    mockProductoRepo.obtenerPorId.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      productoId: 'p1',
      cantidad: 1,
      nombreCliente: 'Juan',
      direccion: 'Calle 123',
      telefono: '1234567890',
      email: 'juan@test.com',
      total: 100,
    });

    expect(result.isErr()).toBe(true);
  });
});
