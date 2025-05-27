import { GetProductosUseCase } from '../obtener-productos.usecase';
import { ProductoRepository } from '../../../domain/ports/productos.repository';
import { Producto } from '../../../domain/models/producto.model';

describe('GetProductosUseCase', () => {
  let useCase: GetProductosUseCase;
  let mockProductoRepo: jest.Mocked<ProductoRepository>;

  beforeEach(() => {
    mockProductoRepo = {
      findAll: jest.fn(),
    } as any;

    useCase = new GetProductosUseCase(mockProductoRepo);
  });

  it('debería retornar una lista de productos con ok', async () => {
    const productosMock: Producto[] = [
      { id: '1', nombre: 'Producto A', descripcion: 'desc', precio: 10, stock: 5 },
      { id: '2', nombre: 'Producto B', descripcion: 'desc', precio: 20, stock: 3 },
    ];

    mockProductoRepo.findAll.mockResolvedValue(productosMock);

    const result = await useCase.execute();

    expect(mockProductoRepo.findAll).toHaveBeenCalled();
    expect(result.isOk()).toBe(true);
  });

  it('debería retornar err si findAll lanza un error', async () => {
    mockProductoRepo.findAll.mockRejectedValue(new Error('DB failure'));

    const result = await useCase.execute();

    expect(result.isErr()).toBe(true);
  });
});
