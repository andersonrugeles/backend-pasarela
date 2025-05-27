import { ActualizarTransaccionUseCase } from '../actualizar-transaccion.usecase';
import { CompraEstado } from '../../../domain/models/compra-status.enum';

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

const mockEntregaRepo = {
  guardar: jest.fn(),
};

describe('ActualizarTransaccionUseCase', () => {
  let useCase: ActualizarTransaccionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ActualizarTransaccionUseCase(
      mockCompraRepo,
      mockProductoRepo,
      mockEntregaRepo
    );
  });

  it('debería retornar error si la compra no existe', async () => {
    mockCompraRepo.obtenerPorId.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'abc', estado: CompraEstado.PENDIENTE });

    expect(result.isErr()).toBe(true);
  });

  it('debería retornar error si el producto no existe en compra exitosa', async () => {
    mockCompraRepo.obtenerPorId.mockResolvedValue({
      id: 'abc',
      productoId: 'p1',
      estado: CompraEstado.PENDIENTE,
    });

    mockProductoRepo.obtenerPorId.mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'abc',
      estado: CompraEstado.EXITOSA,
      cantidad: 1,
    });

    expect(result.isErr()).toBe(true);
  });

  it('debería retornar error si no hay suficiente stock', async () => {
    mockCompraRepo.obtenerPorId.mockResolvedValue({
      id: 'abc',
      productoId: 'p1',
      estado: CompraEstado.PENDIENTE,
    });

    mockProductoRepo.obtenerPorId.mockResolvedValue({
      id: 'p1',
      stock: 0,
    });

    const result = await useCase.execute({
      id: 'abc',
      estado: CompraEstado.EXITOSA,
      cantidad: 5,
    });

    expect(result.isErr()).toBe(true);
  });

  it('debería actualizar producto, guardar entrega y actualizar compra si la transacción es exitosa', async () => {
    const compra = {
      id: 'abc',
      productoId: 'p1',
      estado: CompraEstado.PENDIENTE,
      direccion: 'Calle 1',
    };

    const producto = {
      id: 'p1',
      stock: 10,
    };

    mockCompraRepo.obtenerPorId.mockResolvedValue(compra);
    mockProductoRepo.obtenerPorId.mockResolvedValue(producto);
    mockProductoRepo.actualizar.mockResolvedValue({});
    mockEntregaRepo.guardar.mockResolvedValue({});
    mockCompraRepo.actualizar.mockResolvedValue({ ...compra, estado: CompraEstado.EXITOSA });

    const result = await useCase.execute({
      id: 'abc',
      estado: CompraEstado.EXITOSA,
      cantidad: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(mockProductoRepo.actualizar).toHaveBeenCalledWith(expect.objectContaining({ stock: 7 }));
    expect(mockEntregaRepo.guardar).toHaveBeenCalled();
    expect(mockCompraRepo.actualizar).toHaveBeenCalled();
  });

  it('debería manejar errores inesperados', async () => {
    mockCompraRepo.obtenerPorId.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      id: 'abc',
      estado: CompraEstado.PENDIENTE,
    });

    expect(result.isErr()).toBe(true);
  });
});
