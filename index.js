const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybx1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybx1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('fruitsWare').collection('products');

        app.get('/productItem', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            console.log(product)
            res.send(product);
        });
        app.get('/productItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        //update api using put
        app.put('/productItem/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body.quantites;
            const filter = { _id: ObjectId(id) };
            const opttion = { upsert: true };
            console.log('update quantity', updateQuantity);
            console.log(id);
            const updatedDoc = {
                $set: {
                    quantity: updateQuantity

                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, opttion);

            res.send(result);
        })

        //post

        app.post('/productItem', async (req, res) => {
            const newItem = req.body;
            const result = await productCollection.insertOne(newItem)
            res.send(result);
        })

        //delete
        app.delete('/productItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Fruit is running and waiting for warehouse');
});

app.listen(port, () => {
    console.log('Fruit is running on port', port);
})