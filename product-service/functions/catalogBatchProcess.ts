// import AWS from 'aws-sdk';
import { Client } from 'pg';

import { createQueryToAddProduct, getDbOptions } from './addProduct';

const catalogBatchProcess = async event => {
    const products = event.Records.map(({ body }) => body);

    const client = new Client(getDbOptions());
    await client.connect();
  
    try {    
        products.forEach(async productData => {
            console.log(`Product from queue: ${JSON.stringify(productData)}`);

            const query = createQueryToAddProduct(productData);

            await client.query(query);
        });
    } catch(e) {
  
    } finally {
      client.end();
    }
}

export default catalogBatchProcess;