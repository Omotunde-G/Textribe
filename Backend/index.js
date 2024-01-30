const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require("cors")
// Middleware
app.use(cors())
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
const collaboRoutes = require ('./routes/collabo')


//use the route
app.use('/auth', cors(), authRoutes)
app.use('/users',cors(), userRoutes)
app.use('/stories',cors(), storiesRoutes);
app.use('/contribute', cors(), collaboRoutes )


app.listen(3005, ()=>{
    console.log('server is running on port 3005')
})