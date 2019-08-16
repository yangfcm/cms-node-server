require('./db/mongoose');	// Connect to MongoDB.

const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routers/api/admin');
const userRouter = require('./routers/api/user');
const categoryRouter = require('./routers/api/category');
const commentRouter = require('./routers/api/comment');
const postRouter = require('./routers/api/post');
const tagRouter = require('./routers/api/tag');

const app = express();

app.use(bodyParser.json());
app.use('/api', adminRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', commentRouter);
app.use('/api', postRouter);
app.use('/api', tagRouter);

/** Handles 404 Error */
app.use((req, res, next) => {	
	res.status(404).send({
		name: "404",
		code: 404,
		message: "The url doesn't exist"
	});
});

const port = process.env.PORT;
app.listen(port, () => {
	console.log('App is running on port ' + port);
});