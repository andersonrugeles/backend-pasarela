import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from '../../interfaces/controllers/compra.controller';
import { CrearTransaccionUseCase } from '../../application/use-cases/completar-transaccion.usecase';
import { ActualizarTransaccionUseCase } from '../../application/use-cases/actualizar-transaccion.usecase';
import { Result, ok, err } from '../../shared/result';
import { HttpException } from '@nestjs/common';
import { CompraEstado } from '../../../src/domain/models/compra-status.enum';

describe('CompraController', () => {
    let controller: CompraController;
    let crearTransaccionUseCase: CrearTransaccionUseCase;
    let actualizarTransaccionUseCase: ActualizarTransaccionUseCase;

    beforeEach(async () => {
        const mockCrearTransaccionUseCase = {
            execute: jest.fn(),
        };
        const mockActualizarTransaccionUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompraController],
            providers: [
                { provide: CrearTransaccionUseCase, useValue: mockCrearTransaccionUseCase },
                { provide: ActualizarTransaccionUseCase, useValue: mockActualizarTransaccionUseCase },
            ],
        }).compile();

        controller = module.get<CompraController>(CompraController);
        crearTransaccionUseCase = module.get<CrearTransaccionUseCase>(CrearTransaccionUseCase);
        actualizarTransaccionUseCase = module.get<ActualizarTransaccionUseCase>(ActualizarTransaccionUseCase);
    });

    describe('crearCompra', () => {
        it('debería devolver el resultado si la compra se crea correctamente', async () => {
            const dto = {
                productoId: 'a4f4de50-5b4a-4d18-99aa-112233445566', // UUID válido
                cantidad: 2,
                nombreCliente: 'Jesus',
                telefono: '3281994340',
                email: 'jesus@gmail.com',
                direccion: 'Calle prueba',
                total: 1200,
            };
            const expectedResult = { id: '123', ...dto };

            (crearTransaccionUseCase.execute as jest.Mock).mockResolvedValue(ok(expectedResult));

            const result = await controller.crearCompra(dto);
            expect(crearTransaccionUseCase.execute).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });

        it('debería lanzar HttpException si la compra falla', async () => {
            const dto = {
                productoId: 'a4f4de50-5b4a-4d18-99aa-112233445566', // UUID válido
                cantidad: 2,
                nombreCliente: 'Jesus',
                telefono: '3281994340',
                email: 'jesus@gmail.com',
                direccion: 'Calle prueba',
                total: 1200,
            };
            const errorMessage = 'Error creando compra';

            (crearTransaccionUseCase.execute as jest.Mock).mockResolvedValue(err(new Error(errorMessage)));

            await expect(controller.crearCompra(dto)).rejects.toThrow(HttpException);
            await expect(controller.crearCompra(dto)).rejects.toThrow(errorMessage);
        });
    });

    describe('actualizarCompra', () => {
        it('debería devolver el resultado si la actualización es exitosa', async () => {
            const id = '123';
            const dto = {
                cantidad: 2,
                nombreCliente: 'Jesus',
                telefono: '3281994340',
                total: 1200,
                estado: CompraEstado.EXITOSA
            };
            const expectedResult = { id, ...dto };

            (actualizarTransaccionUseCase.execute as jest.Mock).mockResolvedValue(ok(expectedResult));

            const result = await controller.actualizarCompra(id, dto);
            expect(actualizarTransaccionUseCase.execute).toHaveBeenCalledWith({ id, ...dto });
            expect(result).toEqual(expectedResult);
        });

        it('debería lanzar HttpException si la actualización falla', async () => {
            const id = '123';
            const dto = {
                cantidad: 2,
                nombreCliente: 'Jesus',
                telefono: '3281994340',
                total: 1200,
                estado: CompraEstado.FALLIDA
            };
            const errorMessage = 'Error actualizando compra';

            (actualizarTransaccionUseCase.execute as jest.Mock).mockResolvedValue(err(new Error(errorMessage)));

            await expect(controller.actualizarCompra(id, dto)).rejects.toThrow(HttpException);
            await expect(controller.actualizarCompra(id, dto)).rejects.toThrow(errorMessage);
        });
    });
});
