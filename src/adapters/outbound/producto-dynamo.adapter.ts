import { ProductoRepository } from '../../domain/ports/productos.repository';
import { Producto } from '../../domain/models/producto.model';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export class ProductoDynamoAdapter implements ProductoRepository {
  private client = new DynamoDBClient({ region: 'us-east-1' });
  private docClient = DynamoDBDocumentClient.from(this.client);
  private tableName = 'productos';

  async findAll(): Promise<Producto[]> {
    const command = new ScanCommand({ TableName: this.tableName });
    const result = await this.docClient.send(command);
    return result.Items as Producto[];
  }
}
