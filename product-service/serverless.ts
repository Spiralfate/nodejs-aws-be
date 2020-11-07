import type { Serverless } from 'serverless/aws';
const dbOptions = require('./sql/config.js');

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: dbOptions.host,
      PG_PORT: dbOptions.port,
      PG_DATABASE: dbOptions.database,
      PG_USERNAME: dbOptions.user,
      PG_PASSWORD: dbOptions.password,
    },
  },
  functions: {
    products: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
          }
        }
      ]
    },
    product: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'product/{id}',
          }
        }
      ]
    },
    add: {
      handler: 'handler.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'product',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
