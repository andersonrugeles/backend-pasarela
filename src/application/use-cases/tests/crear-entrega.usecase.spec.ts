import { CrearEntregaUseCase } from '../crear-entrega.usecase';
import { EntregaRepository } from '../../../domain/ports/entrega.repository';

describe('CrearEntregaUseCase', () => {
  let useCase: CrearEntregaUseCase;
  let mockRepo: jest.Mocked<EntregaRepository>;

  beforeEach(() => {
    mockRepo = {
      guardar: jest.fn(),
    };

    useCase = new CrearEntregaUseCase(mockRepo);
  });

  it('debería guardar la entrega y retornar ok', async () => {
    mockRepo.guardar.mockResolvedValue(undefined);

    const data = {
      compraId: 'compra-123',
      direccion: 'Calle Falsa 123',
      fechaEntrega: new Date().toISOString(),
    };

    const result = await useCase.execute(data);

    expect(mockRepo.guardar).toHaveBeenCalled();
    expect(result.isOk()).toBe(true);
  });

  it('debería retornar err si guardar lanza error', async () => {
    mockRepo.guardar.mockRejectedValue(new Error('DB error'));

    const data = {
      compraId: 'compra-123',
      direccion: 'Calle Falsa 123',
      fechaEntrega: new Date().toISOString(),
    };

    const result = await useCase.execute(data);

    expect(result.isErr()).toBe(true);
  });
});
