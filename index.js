const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Fruit is running and waiting for warehouse');
});

app.listen(port, () => {
    console.log('Fruit is running on port', port);
})