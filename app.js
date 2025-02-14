require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path')
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddleware = require('./middleware/authentication')

// router 
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs');
const connectDB = require('./db/connect');

app.use(express.json());
// extra packages

// routes
app.use(express.static(path.resolve(__dirname,'./client/build')))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authMiddleware, jobRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'./client/build', 'index.html'))
})
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
