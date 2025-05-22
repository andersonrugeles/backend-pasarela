import { Compra } from '../../domain/models/compra-status.enum';
import { CompraRepository } from '../../domain/ports/compra.repository';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, ReturnValue } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';

export class CompraDynamoAdapter implements CompraRepository {
  private tableName = 'compras';
  private client = new DynamoDBClient({});

  async crear(compra: Compra): Promise<Compra> {
    const item = {
      ...compra,
      id: compra.id || uuidv4(),
      fechaCreacion: compra.fechaCreacion,
      fechaActualizacion: compra.fechaActualizacion,
    };
    const params = {
      TableName: this.tableName,
      Item: marshall(item),
    };

    await this.client.send(new PutItemCommand(params));
    return item as Compra;
  }

  async actualizar(compra: Compra): Promise<Compra> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id: compra.id }),
      UpdateExpression: `SET estado = :estado, nombreCliente = :nombreCliente, direccion = :direccion, #total = :total, fechaActualizacion = :fechaActualizacion`,
      ExpressionAttributeNames: {
        '#total': 'total',
      },
      ExpressionAttributeValues: {
        ':estado': { S: compra.estado },
        ':nombreCliente': { S: compra.nombreCliente },
        ':direccion': { S: compra.direccion },
        ':total': { N: compra.total.toString() },
        ':fechaActualizacion': { S: new Date().toISOString() },
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const result = await this.client.send(new UpdateItemCommand(params));
    if (!result.Attributes) {
      throw new Error('Compra no encontrada');
    }

    return unmarshall(result.Attributes) as Compra;
  }

  async obtenerPorId(id: string): Promise<Compra | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id }),
    };

    const result = await this.client.send(new GetItemCommand(params));
    if (!result.Item) {
      return null;
    }
    return unmarshall(result.Item) as Compra;
  }
}
