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

const createQueryToAddProduct = async ({ title, description, price }) => {
  if (!title || !description || !price) {
      throw new Error('Insufficient fields');
  }

  const preparedProduct = `('${title}', '${description}', ${price})`;

  const query = {
      text: `insert into products(title, description, price) values ${preparedProduct}`,
  }

  return query;
}

const addProductToDb = async (productData) => {
  const client = new Client(getDbOptions());
  await client.connect();

  let product;

  try {
    const query = createQueryToAddProduct(productData);
    const { rows } = await client.query(query);

    product = rows;
  } catch(e) {

  } finally {
    client.end();
  }

  return Promise.resolve(product);
}



const addProduct: APIGatewayProxyHandler = async event => {
    const product = await addProductToDb(event as any);
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
            product
        }
      ),
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "http://my-2nd-app-er.s3-website-us-east-1.amazonaws.com",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
    };

}

export { createQueryToAddProduct, getDbOptions };
export default addProduct;