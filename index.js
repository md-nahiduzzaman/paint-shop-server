const express = require("express");
const cors = require("cors");
// require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const port = process.env.PORT || 5000;

// config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["https://tripbd-react.web.app", "http://localhost:5173"],
  })
);
app.use(express.json());

//tripbd
// bEbl7cWL8BxCkRwr
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5tdn25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // const tripCollection = client.db("tripDB").collection("products");
    const tripCollection = client.db("tripDB").collection("products");
    const countriesCollection = client.db("tripDB").collection("countries");
    const categoriesCollection = client.db("tripDB").collection("categories");

    app.get("/products", async (req, res) => {
      const cursor = tripCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/countries", async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      console.log(req.body);
      const result = await tripCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    app.get("/updateProduct/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await tripCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/productDetails/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await tripCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.put("/updateProduct/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          item_name: req.body.item_name,
          subcategory_Name: req.body.subcategory_Name,
          short_description: req.body.short_description,
          price: req.body.price,
          rating: req.body.rating,
          customization: req.body.customization,
          processing_time: req.body.processing_time,
          stockStatus: req.body.stockStatus,
        },
      };
      const result = await tripCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    //delete operation
    app.delete("/delete/:id", async (req, res) => {
      const result = await tripCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/myProduct/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await tripCollection
        .find({ userEmail: req.params.email })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/product/:subCategory", async (req, res) => {
      console.log(req.params.subCategory);
      const result = await tripCollection
        .find({ subcategory_Name: req.params.subCategory })
        .toArray();
      res.send(result);
    });

    // app.post("/addProduct", async (req, res) => {
    //   // const newTrip = req.body;
    //   // console.log(newTrip);
    //   console.log(req.body);
    //   const result = await tripCollection.insertOne(req.body);
    //   console.log(result);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is runnging ");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
