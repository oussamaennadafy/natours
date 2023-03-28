const express = require('express');
const app = express()
const port = 8000


app.get('/', (req, res, next) =>
{
 res.status(200).send('<h1>hello from express js</h1>')
})


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})