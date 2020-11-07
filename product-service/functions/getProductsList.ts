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

const fetchProductList = async () => {
  const client = new Client(getDbOptions());
  await client.connect();

  let products;

  try {
    const query = {
      text: 'select * from products join stocks on products.id = stocks.product_id',
    }    
    const { rows } = await client.query(query);

    products = rows;
  } catch(e) {

  } finally {
    client.end();
  }

  return Promise.resolve(products);
}

const getProductsList: APIGatewayProxyHandler = async event => {
    const products = await fetchProductList();
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          products
        }
      ),
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "http://my-2nd-app-er.s3-website-us-east-1.amazonaws.com",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
    };

}

export default getProductsList;