const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require("cors")
const corsOptions = {origin:["http://127.0.0.1:5503"],methods:["GET","POST","PUT","PATCH","DELETE"]}
// Middleware
app.use(cors(corsOptions))
app.use(morgan('tiny'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) =>{
    res.send("Welcome")
})

//routes 
const authRoutes = require ('./routes/auths');
const userRoutes = require ('./routes/users');
const storiesRoutes = require ('./routes/stories')


//use the route
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/stories', storiesRoutes);



app.listen(3002, ()=>{
    console.log('server is running on port 3002')
})