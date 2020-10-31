import { APIGatewayProxyHandler } from 'aws-lambda';
import productsList from '../mocks/productList';

const fetchProductById = async (id) => {
    const products = await Promise.resolve(productsList);
    const product = products.find(product => product.id === id);

  return product;
}

const getProductById: APIGatewayProxyHandler = async event => {
    const product = await fetchProductById(event.queryStringParameters.id);
  
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