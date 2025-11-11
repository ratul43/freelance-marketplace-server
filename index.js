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
    const acceptCollection = db.collection('accepts')

    app.get('/allJobs', async(req, res) => {
    try {
        const result = await jobCollection.find().toArray()
        res.send(result)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


    app.get('/latest-jobs', async (req, res) => {

        const result = await jobCollection.find().sort({
postedAt: 'desc'}).limit(6).toArray()
        
        res.send(result)
    })

    app.post('/addJob', async(req, res) => {
      const data = req.body 
      // console.log(data);
      
      const result = await jobCollection.insertOne(data)

      res.send({
        success: true,
        result
      })

    })


    app.get('/allJobs/:id', async (req, res) => {
      const id = req.params.id
      
      const result = await jobCollection.findOne({_id: new ObjectId(id)})

      
      res.send({
        success: true,
        result
      })
      
    })

    app.put('/updateJob/:id', async(req, res) => {

      const id = req.params.id 
      const data = req.body
     
      
      const objectId = new ObjectId(id)

      const filter = {_id: objectId}

      const update = {
        $set: data 
      }

      const result = await jobCollection.updateOne(filter, update)


      res.send({
        success: true,
        result
      })
    })



    app.delete('/deleteJob/:id', async(req, res) => {
      const id = req.params.id 

      const result = await jobCollection.deleteOne({_id: new ObjectId(id)})
      res.send({
        success: true,
        result
      })
    })


    app.get('/myAddedJobs', async(req, res) => {
      const email = req.query.email 
      
      const result = await jobCollection.find({userEmail: email}).toArray()

      res.send({
        success: true,
        result
      })
    })


    // accepted job routes 

    app.post('/my-accepted-tasks', async(req, res) => {
      const data = req.body 

      const result = await acceptCollection.insertOne(data)

      res.send({
        success: true,
       result
      })

    })

    app.get('/my-accepted-tasks', async(req, res) => {
      const result = await acceptCollection.find().toArray()

      res.send(result)
    })


    app.delete('/doneJobs', async(req, res) => {
      const id = req.query.id 
      const result = await acceptCollection.deleteOne({_id: new ObjectId(id)})
      
      res.send(result)
    })



    app.get('/sort-ascending', async(req, res) => {
      try{
        const result = await jobCollection.find().sort({postedAt: 1}).toArray()
      res.send(result)
      }
      catch(error){
         res.status(500).send({ error: error.message })
      }
    })


    app.get('/sort-descending', async(req, res) => {
      try {
        const result = await jobCollection.find().sort({postedAt: -1}).toArray()
        res.send(result) // CHANGED: Send the actual data
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
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