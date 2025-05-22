import { ProductoRepository } from '../../domain/ports/productos.repository';
import { Producto } from '../../domain/models/producto.model';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export class ProductoDynamoAdapter implements ProductoRepository {
  private client = new DynamoDBClient({ region: 'us-east-1' });
  private docClient = DynamoDBDocumentClient.from(this.client);
  private tableName = 'productos';

  async findAll(): Promise<Producto[]> {
    const command = new ScanCommand({ TableName: this.tableName });
    const result = await this.docClient.send(command);
    return result.Items as Producto[];
  }

  async obtenerPorId(id: string): Promise<Producto | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.client.send(command);
    if (!response.Item) return null;
    return unmarshall(response.Item) as Producto;
  }

  async actualizar(producto: Producto): Promise<Producto> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id: producto.id }),
      UpdateExpression: 'SET #nombre = :nombre, #descripcion = :descripcion, #precio = :precio, #stock = :stock',
      ExpressionAttributeNames: {
        '#nombre': 'nombre',
        '#descripcion': 'descripcion',
        '#precio': 'precio',
        '#stock': 'stock',
      },
      ExpressionAttributeValues: marshall({
        ':nombre': producto.nombre,
        ':descripcion': producto.descripcion,
        ':precio': producto.precio,
        ':stock': producto.stock,
      }),
      ReturnValues: 'ALL_NEW',
    });

    const response = await this.client.send(command);
    if (!response.Attributes) throw new Error('Error actualizando producto');

    return unmarshall(response.Attributes) as Producto;
  }
}
