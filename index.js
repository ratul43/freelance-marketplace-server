const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000 

require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sb5wtw8.mongodb.net/?appName=Cluster0`

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
    await client.connect();

    const db = client.db('smart_db')
    const jobCollection = db.collection('jobs')

    app.get('/jobs', async (req, res) => {

        const result = await jobCollection.find().toArray()
        
        res.send(result)
    })


    app.get('/latest-jobs', async (req, res) => {

        const result = await jobCollection.find().sort({
postedAt: 'desc'}).limit(6).toArray()
        
        res.send(result)
    })

    app.post('/jobs', async(req, res) => {
      const data = req.body 
      // console.log(data);
      
      const result = await jobCollection.insertOne(data)

      res.send({
        success: true,
        result
      })

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


















app.get('/', (req, res)=> {
    res.send("Hello world")
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})