import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'
import morgan from 'morgan'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('APP IS RUNNING')
})
mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running at ${PORT}`)))
    .catch((err) => console.log(err))
mongoose.set('useFindAndModify', false)