import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';

import * as config from '../serverless';

const getDbOptions = () => {
  const {
    PG_HOST: host,
    PG_PORT: port,
    PG_DATABASE: database,
    PG_USERNAME: user,
    PG_PASSWORD: password,
  } = (config as any).provider.environment;

  return {
    host,
    port,
    database,
    user,
    password,
  };
}

const fetchProductById = async (id) => {
  const client = new Client(getDbOptions());
  await client.connect();

  let products;

  try {
    const query = {
      text: `select * from products where id = '${id}'`,
    }    
    const { rows } = await client.query(query);

    products = rows;
  } catch(e) {

  } finally {
    client.end();
  }

  return Promise.resolve(products);
}

const getProductById: APIGatewayProxyHandler = async event => {
    const product = await fetchProductById(event.pathParameters.id);
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          product,
        }
      ),
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "http://my-2nd-app-er.s3-website-us-east-1.amazonaws.com",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
    };

}

export default getProductById;