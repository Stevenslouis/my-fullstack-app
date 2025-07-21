const express = require('express')
const connectToDB = require('./database/database')
const app = express()
require('dotenv').config()

const quizRoutes = require('./routes/quiz-route')
const authRoutes = require('./routes/auth-route')
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));


connectToDB()

app.use(express.json())

app.use(cookieParser());

app.use('/api/quizzes', quizRoutes); 
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`server is now listening to port ${PORT}`);

})

