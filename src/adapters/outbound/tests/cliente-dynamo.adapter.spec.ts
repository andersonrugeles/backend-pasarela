import { ClienteDynamoAdapter } from '../cliente-dynamo.adapter';
import { Cliente } from '../../../domain/models/cliente.model';
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb', () => ({
  marshall: jest.fn(),
  unmarshall: jest.fn(),
}));

describe('ClienteDynamoAdapter', () => {
  let adapter: ClienteDynamoAdapter;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    adapter = new ClienteDynamoAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debería guardar un cliente en DynamoDB y devolverlo con id y fechaCreacion', async () => {
      const cliente: Cliente = {
        id:'sakd',
        nombre: 'Juan',
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
        email: 'juan@email.com',
        fechaCreacion: new Date().toISOString()
      };

      (marshall as jest.Mock).mockReturnValue({ mocked: 'item' });

      mockSend.mockResolvedValue({});

      const result = await adapter.crear(cliente);

      expect(marshall).toHaveBeenCalledWith(expect.objectContaining({
        ...cliente,
        id: expect.any(String),
        fechaCreacion: expect.any(String),
      }));
      expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand));
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('fechaCreacion');
    });
  });

  describe('buscarPorEmail', () => {
    it('debería devolver un cliente si se encuentra en DynamoDB', async () => {
      const email = 'juan@email.com';
      const mockCliente = { nombreCliente: 'Juan', email };

      mockSend.mockResolvedValue({
        Items: [{ mocked: 'item' }],
      });

      (unmarshall as jest.Mock).mockReturnValue(mockCliente);

      const result = await adapter.buscarPorEmail(email);

      expect(mockSend).toHaveBeenCalledWith(expect.any(ScanCommand));
      expect(result).toEqual(mockCliente);
    });

    it('debería devolver null si no encuentra ningún cliente', async () => {
      const email = 'no@existe.com';

      mockSend.mockResolvedValue({
        Items: [],
      });

      const result = await adapter.buscarPorEmail(email);

      expect(result).toBeNull();
    });
  });
});
