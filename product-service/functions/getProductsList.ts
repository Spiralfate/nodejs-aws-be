import { APIGatewayProxyHandler } from 'aws-lambda';
import productsList from '../mocks/productList';

const fetchProductList = () => {
  return Promise.resolve(productsList);
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