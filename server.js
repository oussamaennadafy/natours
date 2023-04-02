const app = require('./app')
const port = 8000

app.listen(port, () =>
{
 console.log(`server running on port ${port} ...`);
})