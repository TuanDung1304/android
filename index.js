import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();

//import Routes
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import postsRoute from './routes/posts.js';
import commentsRoute from './routes/comments.js';
import conversationRoute from './routes/conversation.js';
import messageRoute from './routes/message.js';
import imageRoute from './routes/image.js';
import notificationRoute from './routes/notification.js';

dotenv.config();

//connect to db
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECT, () => console.log('Connected to DB!'));

//Middleware
app.use(express.json());
app.use(cors());

//Route middlewares
app.use('/api/users', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/images', imageRoute);
app.use('/api/notifications', notificationRoute);

app.listen(3001, () =>
  console.log('Server up an running: http://localhost:3001')
);
