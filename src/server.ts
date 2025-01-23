import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import { corsConfig } from './config/cors'
import publicacionRouter from './routes/publicacionRouter'
import comentarioRouter from './routes/comentarioRoutes'

dotenv.config()

connectDB()

const app = express();
app.use(cors(corsConfig))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/publicaciones',publicacionRouter)
app.use('/api/comentarios',comentarioRouter)

export default app