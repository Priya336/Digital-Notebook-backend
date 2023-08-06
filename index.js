const connectToMongo=require('./db');
connectToMongo();
const express = require('express')
const cors=require("cors");

const app = express()
const port = 3001
app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/priya', (req, res) => {
  res.send('Hello priya!')
})

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})