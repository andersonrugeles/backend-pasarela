import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { GetProductosUseCase } from '../../application/use-cases/obtener-productos.usecase';

const mockGetProductosUseCase = {
  execute: jest.fn(),
};

describe('ProductosController', () => {
  let controller: ProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: GetProductosUseCase,
          useValue: mockGetProductosUseCase,
        },
      ],
    })
      // Sobrescribimos el provider con el mock (porque tu controlador lo crea internamente, en constructor no inyectas)
      .overrideProvider(GetProductosUseCase)
      .useValue(mockGetProductosUseCase)
      .compile();

    controller = module.get<ProductosController>(ProductosController);
  });

  it('should return products when use case succeeds', async () => {
    const productosMock = [
      { id: '1', nombre: 'Producto 1', precio: 100 },
      { id: '2', nombre: 'Producto 2', precio: 200 },
    ];
    mockGetProductosUseCase.execute.mockResolvedValueOnce({
      isErr: () => false,
      value: productosMock,
    });

    const resultado = await controller.obtenerProductos();
    expect(resultado).toEqual(productosMock);
  });

  it('should return error when use case fails', async () => {
    const errorMock = new Error('Error interno');
    mockGetProductosUseCase.execute.mockResolvedValueOnce({
      isErr: () => true,
      error: errorMock,
    });

    const resultado = await controller.obtenerProductos();
    expect(resultado).toEqual({ error: errorMock.message });
  });
});
