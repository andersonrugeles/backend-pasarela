import { ClienteRepository } from '../../domain/ports/cliente.repository';
import { Cliente } from '../../domain/models/cliente.model';
import { err, ok, Result } from '../../shared/result';
import { Inject, Injectable } from '@nestjs/common';
import { CLIENTE_REPOSITORY } from 'src/common/tokens';

interface Input {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string
}
@Injectable()
export class CrearClienteUseCase {
    constructor(
        @Inject(CLIENTE_REPOSITORY)
        private readonly clienteRepository: ClienteRepository
    ) { }

    async execute(input: Input): Promise<Result<Cliente, Error>> {
        try {
            const clienteExistente = await this.clienteRepository.buscarPorEmail(input.email);

            if (clienteExistente) {
                return ok(clienteExistente);
            }

            const nuevoCliente: Cliente = {
                id: '',
                nombre: input.nombre,
                email: input.email,
                telefono: input.telefono,
                direccion: input.direccion,
                fechaCreacion: '',
            };

            const clienteCreado = await this.clienteRepository.crear(nuevoCliente);
            return ok(clienteCreado);
        } catch (error) {
            return err(new Error('Error al buscar o crear el cliente'));
        }
    }
}
