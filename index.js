const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port  = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// console.log(process.env.DB_USER)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3worizk.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const MYDB= client.db('sohojsebaDB')
    const ReviewsCollection = MYDB.collection('reviews')
    const DoctorsCollection = MYDB.collection('doctors')
    const ServicesCollection = MYDB.collection('services')
    const UsersCollection = MYDB.collection('users')


    // users api 
    app.get('/users',async(req,res)=>{
        const result = await UsersCollection.find().toArray();
        res.send(result)
    })

    app.post('/users',async(req,res)=>{
       const user = req.body;
       const email = {email:user.email};
       const userExist = await UsersCollection.findOne(email);
       if(userExist){
          return res.send({message:'this user email alredy in database', insertedId : null});
       }; 
       const result = await UsersCollection.insertOne(user);
       res.send(result);
    });


    // services api
    app.get('/services',async(req,res)=>{
        const result = await ServicesCollection.find().toArray();
        res.send(result)
    })

    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const filters = {_id : new ObjectId(id)}
        const result = await ServicesCollection.findOne(filters);
        res.send(result)
    })


    // doctros api
    app.get('/doctors',async(req,res)=>{
        const result = await DoctorsCollection.find().toArray();
        res.send(result)
    })

    app.get('/doctors/:id',async(req,res)=>{
        const id = req.params.id;
        const filters = {_id : new ObjectId(id)}
        const result = await DoctorsCollection.findOne(filters);
        res.send(result)
    })

    // reviews api
    app.get('/reviews',async(req,res)=>{
        const result = await ReviewsCollection.find().toArray();
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('SOHOJ_SEBA IS RUNNING ON SERVER')
})
app.listen(port,()=>{
    console.log('my port is running on port no : ' , port)
})