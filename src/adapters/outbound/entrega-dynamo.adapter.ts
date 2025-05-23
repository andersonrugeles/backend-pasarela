import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Entrega } from '../../domain/models/entrega.model';
import { EntregaRepository } from '../../domain/ports/entrega.repository';

export class EntregaDynamoAdapter implements EntregaRepository {
  private readonly tableName = 'entregas';
  private readonly client = new DynamoDBClient({});

    async guardar(entrega: Entrega): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: marshall(entrega),
        };

        await this.client.send(new PutItemCommand(params));
    }

}
