import { CompraDynamoAdapter } from '../compra-dynamo.adapter';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Compra, CompraEstado } from '../../../domain/models/compra-status.enum';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb', () => ({
    marshall: jest.fn(),
    unmarshall: jest.fn(),
}));

describe('CompraDynamoAdapter', () => {
    let adapter: CompraDynamoAdapter;
    let mockSend: jest.Mock;

    beforeEach(() => {
        mockSend = jest.fn();
        (DynamoDBClient as jest.Mock).mockImplementation(() => ({
            send: mockSend,
        }));
        adapter = new CompraDynamoAdapter();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const compraBase: Compra = {
        id: 'test-id',
        productoId: 'prod-123',
        cantidad: 2,
        total: 1000,
        nombreCliente: 'Pedro',
        direccion: 'Calle 1',
        estado: CompraEstado.EXITOSA,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
    };

    describe('crear', () => {
        it('debería guardar una compra en DynamoDB y devolverla', async () => {
            (marshall as jest.Mock).mockReturnValue({ mocked: 'item' });
            mockSend.mockResolvedValue({});

            const result = await adapter.crear(compraBase);

            expect(marshall).toHaveBeenCalledWith(expect.objectContaining({
                ...compraBase,
                id: compraBase.id,
                fechaCreacion: expect.any(String),
                fechaActualizacion: expect.any(String),
            }));
            expect(mockSend).toHaveBeenCalledWith(expect.any(PutItemCommand));
            expect(result.id).toBe(compraBase.id);
        });
    });

    describe('actualizar', () => {
        it('debería actualizar una compra y devolver la versión actualizada', async () => {
            const updatedCompra = {
                estado: CompraEstado.EXITOSA, id: 'sdafds',
                productoId: '24342',
                cantidad: 1,
                nombreCliente: 'prueba',
                direccion: 'dir',
                total: 1200,
            };

            mockSend.mockResolvedValue({
                Attributes: { updated: 'data' },
            });

            (unmarshall as jest.Mock).mockReturnValue(updatedCompra);

            const result = await adapter.actualizar(updatedCompra);

            expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
            expect(result.estado).toBe('EXITOSA');
        });

        it('debería lanzar error si no se encuentra la compra a actualizar', async () => {
            mockSend.mockResolvedValue({ Attributes: undefined });

            await expect(adapter.actualizar(compraBase)).rejects.toThrow('Compra no encontrada');
        });
    });

    describe('obtenerPorId', () => {
        it('debería devolver la compra si se encuentra', async () => {
            mockSend.mockResolvedValue({
                Item: { mocked: 'item' },
            });
            (unmarshall as jest.Mock).mockReturnValue(compraBase);

            const result = await adapter.obtenerPorId('test-id');

            expect(mockSend).toHaveBeenCalledWith(expect.any(GetItemCommand));
            expect(result).toEqual(compraBase);
        });

        it('debería devolver null si no se encuentra la compra', async () => {
            mockSend.mockResolvedValue({ Item: undefined });

            const result = await adapter.obtenerPorId('no-id');

            expect(result).toBeNull();
        });
    });
});
