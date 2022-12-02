const express = require("express");
const Joi = require("joi");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const customers = [
    {id: 1, name: "Jack"},
    {id: 2, name: "Jill"},
    {id: 3, name: "Mary"},
    {id: 4, name: "Bob"}
]

app.get('/', (req, res) => {
    res.send("NodeJS - Express - CRUD Excercise");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/api/customers', (req, res) => {
    res.send(JSON.stringify(customers));
});

app.get('/api/customers/:id', (req, res) => {
    const cust = customers.find(c => {
        return c.id == parseInt(req.params.id);
    });
    if (!cust) return res.status(404).send("The customer with give ID could not be found");
    res.send(cust);
});

app.post('/api/customers', (req, res) => {
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cust = {
        id: customers.length + 1,
        name: req.body.name
    };
    customers.push(cust);
    res.send(cust);
});

app.put('/api/customers/:id', (req, res) => {
    const cust = customers.find(c => {
        return c.id == parseInt(req.params.id);
    });
    if (!cust) return res.status(404).send("The customer with give ID could not be found");

    const {error} = validateCustomer(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    cust.name = req.body.name;
    res.send(cust);
});

app.delete('/api/customers/:id', (req, res) => {
    const cust = customers.find(c => {
        return c.id == parseInt(req.params.id);
    });
    if (!cust) return res.status(404).send("The customer with give ID could not be found");

    const index = customers.indexOf(cust);
    customers.splice(index,1);
    res.send(cust);
});

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(customer, schema);
}