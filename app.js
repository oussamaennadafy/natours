const express = require('express');
const app = express()
const port = 8000


app.get('/', (req, res, next) =>
{
 res.status(200).send('<h1>you try to get from express server</h1>')
})

app.post('/', (req, res, next) =>
{
 res.status(200).send('<h1>you try to post to express server</h1>')
})


app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})