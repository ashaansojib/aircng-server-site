const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9988;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('The server is running')
});


const uri = `mongodb+srv://${process.env.AIR_Username}:${process.env.AIR_Password}@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const resortCollection = client.db('resortCollection').collection('all-resorts');
    // get all resord data
    app.get('/resorts', async (req, res) => {
      const allResorts = await resortCollection.find().toArray();
      res.send(allResorts)
    });
    app.get('/resorts-in/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category: { $regex: new RegExp(category, "i") } }
      const result = await resortCollection.find(query).toArray();
      res.send(result)
    })
    // seaarch by name
    app.get('/resorts-collection', async (req, res) => {
      const searchQuery = req.query.q;
      const regexPattern = new RegExp(searchQuery, 'i');
      const searchResult = await resortCollection.find({
        $or: [
          { name: { $regex: regexPattern } },
          { category: { $regex: regexPattern } }
        ]
      }).toArray();
      res.send(searchResult);
    });
    // sort by price
    app.get('/price-range', async(req, res)=>{
      const minPrice = parseFloat(req.query.price);
      let query = {
        price: {$lte: minPrice}
      }
      const result = await resortCollection.find(query).toArray();
      res.send(result)
    })
    // add room api
    app.post('/add-room', async(req, res)=>{
      const roomInfo = req.body;
      const result = await resortCollection.insertOne(roomInfo);
      res.send(result)
    });
    // 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log('the port is running on:', port)
})