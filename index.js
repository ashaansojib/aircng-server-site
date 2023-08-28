const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9988;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())
// ZjMlKPajdMvFp31l ashaduzzamansojib67
app.get('/', (req,res) =>{
    res.send('The server is running')
});


const uri = "mongodb+srv://ashaduzzamansojib67:ZjMlKPajdMvFp31l@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority";

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
    app.get('/resorts', async(req, res) =>{
        const allResorts = await resortCollection.find().toArray();
        res.send(allResorts)
    });
    app.get('/resorts-in/:location', async(req, res)=>{
        const query = req.params.id;
        console.log(query)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log('the port is running on:', port)
})