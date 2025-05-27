import { EntregaDynamoAdapter } from '../entrega-dynamo.adapter';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Entrega } from '../../../domain/models/entrega.model';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: jest.fn(),
}));

describe('EntregaDynamoAdapter', () => {
  let adapter: EntregaDynamoAdapter;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    adapter = new EntregaDynamoAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería guardar una entrega en DynamoDB', async () => {
    const entrega: Entrega = {
      id: 'entrega-1',
      compraId: 'compra-1',
      direccion: 'Calle 123',
      fechaEntrega: new Date().toISOString(),
      estado: 'PENDIENTE',
    };

    (marshall as jest.Mock).mockReturnValue({ mocked: 'item' });
    mockSend.mockResolvedValue({});

    await adapter.guardar(entrega);

    expect(marshall).toHaveBeenCalledWith(entrega);
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand));
  });
});
