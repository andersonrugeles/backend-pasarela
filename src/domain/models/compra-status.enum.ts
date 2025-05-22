export enum CompraEstado {
  PENDIENTE = 'PENDIENTE',
  EXITOSA = 'EXITOSA',
  FALLIDA = 'FALLIDA',
}

export interface Compra {
  id: string;
  productoId: string;
  cantidad: number;
  estado: CompraEstado;
  nombreCliente: string;
  direccion: string;
  total: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}