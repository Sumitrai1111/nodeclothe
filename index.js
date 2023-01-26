let express = require('express');
let app = express();
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 9900;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = "mongodb://localhost:27017";
let cors = require('cors')
let bodyParser = require('body-parser');
let db;
//middleware(supporting libraries)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//for category
app.get('/category', (req, res) => {
    db.collection('category').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//for product
app.get('/product', (req, res) => {
    db.collection('product').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//for product with respect to category
app.get('/product/:categoryId', (req, res) => {
    let categoryId = Number(req.params.categoryId);
    db.collection('product').find({category_id:categoryId}).toArray ((err, result) => {
        if(err) throw err
        res.send(result);
    });
});
//for product detail
app.get('/productDetail/:productId', (req, res) => {
    let productId = Number(req.params.productId);
    db.collection('product').find({ id: productId }).toArray ((err, result) => {
        if (err) throw err
        res.send(result);
    })
})
  
//order with respect to email
app.get('/orders',(req,res) => {
    let email = req.query.email;
    let query = {};
    if(email){
        query={email:email}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
})
//placeorder
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed');
    })
})
//update order *http://localhost:9000/updateOrder/1
app.put('/updateOrder/:order_id',(req,res) => {
    let oid = Number(req.params.order_id);
    db.collection('Orders').updateOne(
        {order_id:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Order Updated');
        }
        )
})
//Delete Order *http://localhost:9000/deleteOrder/63cf8331608a6efc84cabb25
app.delete('/deleteOrder/:id',(req,res) =>{
    let _id = mongo.ObjectId(req.params.id);
    db.collection('Orders').remove({_id},(err,result) => {
        if(err) throw err;
        res.send('Order Deleted');
    })
})
//conection with database
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log('Error while connecting');
    db = client.db('clothe');
    app.listen(port, () => {
        console.log(`server is running on ${port}`)
    })
})
