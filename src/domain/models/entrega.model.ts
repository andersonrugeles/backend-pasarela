export interface Entrega {
  id: string;
  compraId: string;
  fechaEntrega: string;
  direccion: string;
  estado: 'PENDIENTE' | 'EN_CAMINO' | 'ENTREGADA';
}