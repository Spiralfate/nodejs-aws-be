const { Client } = require('pg');

const productList = require('../../mocks/productList');
const dbOptions = require('../config');

const fillProductsTableWithMocks = async () => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        console.log('Creating products table... ');
        createTable(client);

        console.log('Filling products table... ');
        fillTable(client, productList);

        const { rows } = await client.query('select * from products');

        console.log('Rows after inserting: ', rows);
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }
}

const createTable = async (client) => {
    const createTablequery = {
        text: 'create table if not exists products(id uuid primary key default uuid_generate_v4(), title text, description text, price integer not null)',
    };
    await client.query(createTablequery);
}

const fillTable = async (client, items) => {
    const preparedProducts = items.map(({id, title, description, price }) => `('${id}', '${title}', '${description}', ${price})`).join(',');

    const insertIntoQuery = {
        text: `insert into products(id, title, description, price) values ${preparedProducts}`,
    }
    await client.query(insertIntoQuery);
}

fillProductsTableWithMocks();