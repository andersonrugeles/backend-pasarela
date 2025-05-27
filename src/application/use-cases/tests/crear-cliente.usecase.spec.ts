import { CrearClienteUseCase } from '../crear-cliente.usecase';
import { ClienteRepository } from '../../../domain/ports/cliente.repository';
import { Cliente } from '../../../domain/models/cliente.model';

describe('CrearClienteUseCase', () => {
  let useCase: CrearClienteUseCase;
  let mockClienteRepo: jest.Mocked<ClienteRepository>;

  beforeEach(() => {
    mockClienteRepo = {
      buscarPorEmail: jest.fn(),
      crear: jest.fn(),
    };

    useCase = new CrearClienteUseCase(mockClienteRepo);
  });

  it('debería retornar el cliente existente si ya está registrado', async () => {
    const existingClient: Cliente = {
      id: '1',
      nombre: 'Ana',
      email: 'ana@mail.com',
      telefono: '12345',
      direccion: 'Calle A',
      fechaCreacion: '2024-01-01T00:00:00Z',
    };

    mockClienteRepo.buscarPorEmail.mockResolvedValue(existingClient);

    const result = await useCase.execute({
      nombre: 'Ana',
      email: 'ana@mail.com',
      telefono: '12345',
      direccion: 'Calle A',
    });

    expect(result.isOk()).toBe(true);
    expect(mockClienteRepo.crear).not.toHaveBeenCalled();
  });

  it('debería crear un nuevo cliente si no existe', async () => {
    mockClienteRepo.buscarPorEmail.mockResolvedValue(null);

    const nuevoCliente: Cliente = {
      id: '2',
      nombre: 'Luis',
      email: 'luis@mail.com',
      telefono: '67890',
      direccion: 'Calle B',
      fechaCreacion: new Date().toISOString(),
    };

    mockClienteRepo.crear.mockResolvedValue(nuevoCliente);

    const result = await useCase.execute({
      nombre: 'Luis',
      email: 'luis@mail.com',
      telefono: '67890',
      direccion: 'Calle B',
    });

    expect(result.isOk()).toBe(true);
    expect(mockClienteRepo.buscarPorEmail).toHaveBeenCalledWith('luis@mail.com');
    expect(mockClienteRepo.crear).toHaveBeenCalled();
  });

  it('debería retornar un error si ocurre una excepción', async () => {
    mockClienteRepo.buscarPorEmail.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute({
      nombre: 'Carlos',
      email: 'carlos@mail.com',
      telefono: '99999',
      direccion: 'Calle C',
    });

    expect(result.isErr()).toBe(true);
  });
});
