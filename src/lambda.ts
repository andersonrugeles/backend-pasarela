import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();

    const allowedOrigins = [
      'https://d1d96urffogc3d.cloudfront.net',
      'http://localhost:5173'
    ]; 

    expressApp.use((req: any, res: any, next: any) => {
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      next();
    });


    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);


    const config = new DocumentBuilder()
      .setTitle('API Tienda')
      .setDescription('Documentación de la API para el flujo de productos y compras')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    expressApp.get('/docs-json', (req, res) => {
      res.json(document);
    });
    await app.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
