const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const config = require('../config');
const db = {
    products: require('./db/products.json'),
    lists: require('./db/lists.json'),
};

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('[%s] %s %s', req.method, req.url.split('?')[0], JSON.stringify(req.body));
    next();
})

/*************************************/
/********* PRODUCT ENDPOINTS *********/
/*************************************/

app.get('/api/product/:id', (req, res) => {
    const { id }  = req.params;
    const match = db.products.find(item => String(item.id) === id);
    if (!match) return res.status(400).json({ error: `Product not found: id=${id}` });
    return res.json(match);
});

app.get('/api/products', (req, res) => {
    let { query: { filters, limit = db.products.length, skip = 0 } } = req;

    if (filters) {
        try { filters = JSON.parse(filters); }
        catch (ex) {
            return res.status(400).json({ error: 'Invalid filters, not JSON: ' + filters });
        }
    }

    let result = db.products;

    const textFilter = property => {
        if (!filters[property]) return result;

        const searchPhrase = filters[property].trim().toLowerCase();

        return result.filter(item =>
            item[property] && item[property].toLowerCase().includes(searchPhrase)
        );
    };

    const numericFilter = property => {
        if (!filters[property]) return result;

        let [, compare = '=', number] = String(filters[property]).match(/([<>])?\s*(\d+)/);
        number = parseFloat(number);

        if (Number.isNaN(number)) {
            return res.status(400).json({ error: `Invalid ${property} = ${filters[property]}` });
        }

        const filter = ({
            '>':  value => value > number,
            '>=': value => value >= number,
            '<':  value => value < number,
            '<=': value => value <= number,
            '=':  value => value === number,
        })[compare];

        return result.filter(item => {
            const value = _.get(item, property);
            if (value == null) return false;
            return filter(value);
        });
    };

    const arrayFilter = property => {
        if (!filters[property]) return result;

        let searchList = filters[property];
        if (!Array.isArray(searchList)) searchList = [searchList];

        if (!searchList.length) return result;

        return result.filter(item =>
            item[property] && item[property].some(badge => searchList.includes(badge))
        );
    };

    result = textFilter('name');
    result = textFilter('brand');

    // result = arrayFilter('badges');
    result = arrayFilter('diets');
    result = arrayFilter('allergens');

    result = numericFilter('nutrition.calories');
    result = numericFilter('nutrition.protein');
    result = numericFilter('nutrition.totalFat');
    result = numericFilter('nutrition.fiber');
    result = numericFilter('nutrition.sugar');
    result = numericFilter('nutrition.saturatedFat');

    res.json({
        total: result.length,
        skip,
        limit,
        filters: req.query.filters,
        result: result.slice(skip, skip + limit),
    });
});

/*****************************************/
/******** SHOPPING LIST ENDPOINTS ********/
/*****************************************/

app.get('/api/lists', (req, res) => {
    res.json({
        total: db.lists.length,
        result: db.lists,
    });
});

app.post('/api/list', (req, res) => {
    const { body } = req;

    if (!body.name) throw 'Missing name';
    if (!body.products) throw 'Missing products';
    if (!Array.isArray(body.products)) throw 'Products must be an array';
    if (body.products.some(id => (typeof id !== 'number'))) {
        throw 'Products must be a list of numeric product ids'
    }

    const item = {
        id: db.lists.length,
        name: body.name,
        products: body.products,
        date: (new Date).toISOString(),
    };

    db.lists.push(item);

    res.json({ success: true, result: item });
});

app.get('/api/list/:id', (req, res) => {
    const { id }  = req.params;
    const match = db.lists.find(item => String(item.id) === id);
    if (!match) return res.status(400).json({ error: `Shopping List not found: id=${id}` });
    return res.json(match);
});

/*********************************/
/*********** SETUP API ***********/
/*********************************/

app.use((error, req, res, next) => {
    res.status(500).json({
        error: error.stack || error.message || String(error),
    });
});

server.listen(config.serverPort, error => {
    if (error) {
        console.error(error);
        console.error('Failed starting server on port:', server.address().port);
        return;
    };

    console.log('Server listening on port ', server.address().port);
});
