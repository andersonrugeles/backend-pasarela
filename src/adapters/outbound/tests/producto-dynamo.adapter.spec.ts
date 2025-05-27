import { ProductoDynamoAdapter } from '../producto-dynamo.adapter';
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Producto } from '../../../domain/models/producto.model';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');
jest.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: jest.fn(),
  unmarshall: jest.fn(),
}));

describe('ProductoDynamoAdapter', () => {
  let adapter: ProductoDynamoAdapter;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));

    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({
      send: mockSend,
    });

    adapter = new ProductoDynamoAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería obtener todos los productos con findAll()', async () => {
    const productos = [{ id: '1', nombre: 'P1' }];
    mockSend.mockResolvedValue({ Items: productos });

    const result = await adapter.findAll();

    expect(mockSend).toHaveBeenCalledWith(expect.any(ScanCommand));
    expect(result).toEqual(productos);
  });

  it('debería obtener un producto por ID', async () => {
    const producto = { id: '1', nombre: 'P1' };
    (marshall as jest.Mock).mockReturnValue({ mocked: 'key' });
    (unmarshall as jest.Mock).mockReturnValue(producto);
    mockSend.mockResolvedValue({ Item: { mocked: 'item' } });

    const result = await adapter.obtenerPorId('1');

    expect(mockSend).toHaveBeenCalledWith(expect.any(GetItemCommand));
    expect(result).toEqual(producto);
  });

  it('debería retornar null si no existe el producto', async () => {
    mockSend.mockResolvedValue({ Item: undefined });

    const result = await adapter.obtenerPorId('no-id');

    expect(result).toBeNull();
  });

  it('debería actualizar un producto', async () => {
    const producto: Producto = {
      id: '1',
      nombre: 'P1',
      descripcion: 'Desc',
      precio: 100,
      stock: 10,
    };

    (marshall as jest.Mock).mockReturnValueOnce({ id: '1' }); // Key
    (marshall as jest.Mock).mockReturnValueOnce({
      ':nombre': 'P1',
      ':descripcion': 'Desc',
      ':precio': 100,
      ':stock': 10,
    });
    (unmarshall as jest.Mock).mockReturnValue(producto);

    mockSend.mockResolvedValue({ Attributes: { mocked: 'attrs' } });

    const result = await adapter.actualizar(producto);

    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
    expect(result).toEqual(producto);
  });

  it('debería lanzar error si no se actualiza el producto', async () => {
    const producto: Producto = {
      id: '1',
      nombre: 'P1',
      descripcion: 'Desc',
      precio: 100,
      stock: 10,
    };

    mockSend.mockResolvedValue({ Attributes: undefined });

    await expect(adapter.actualizar(producto)).rejects.toThrow(
      'Error actualizando producto'
    );
  });
});
