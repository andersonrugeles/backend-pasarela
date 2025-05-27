import { Cliente } from '../../domain/models/cliente.model';
import { ClienteRepository } from '../../domain/ports/cliente.repository';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
@Injectable()
export class ClienteDynamoAdapter implements ClienteRepository {
  private client = new DynamoDBClient({});
  private tableName = 'clientes';

  async crear(cliente: Cliente): Promise<Cliente> {
      const item = {
          ...cliente, id: randomUUID(),
          fechaCreacion: new Date().toISOString()
      };
    const params = {
      TableName: this.tableName,
      Item: marshall(item),
    };
    await this.client.send(new PutItemCommand(params));
    return item;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
    };

    const result = await this.client.send(new ScanCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return unmarshall(result.Items[0]) as Cliente;
  }

}
