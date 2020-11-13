const { Client } = require('pg');

const productList = require('../../mocks/productList');
const dbOptions = require('../config');

const fillStocksTableWithMocks = async () => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        createTable(client);

        fillTable(client, productList);

        const { rows } = await client.query('select * from stocks');

        console.log('Rows after inserting: ', rows);
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }
}

const createTable = async (client) => {
    const createTablequery = {
        text: 'create table if not exists stocks(product_id uuid, count integer, foreign key ("product_id") references "products" ("id"))',
    };
    await client.query(createTablequery);
}

const fillTable = async (client, items) => {

    const preparedStocks = items.map(({ id, count }) => `('${id}', ${count})`).join(',');

    const insertIntoQuery = {
        text: `insert into stocks(product_id, count) values ${preparedStocks}`,
    }

    console.log("insertIntoQuery: ", insertIntoQuery)

    await client.query(insertIntoQuery);
}

fillStocksTableWithMocks();