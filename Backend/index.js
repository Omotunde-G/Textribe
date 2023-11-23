const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send("Welcome to Textribe")
})

app.use(express.json());
//routes 
const authRoutes = require ('./routes/auths')

//use the route
app.use('/auth', authRoutes)

app.listen(3002, ()=>{
    console.log('server is running on port 3002')
})