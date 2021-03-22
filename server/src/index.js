const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const RouteHandler = require('./utils/RouteHandler');
const TaskController = require('./controllers/TaskController');

const app = express();
const routeHandler = new RouteHandler();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/task/recording', routeHandler.route((req, res) => new TaskController(req, res).recording()));
app.get('/task/stats', routeHandler.route((req, res) => new TaskController(req, res).stats())); 

/**
 * Error Handler
 */
app.use((err, req, res, next) => routeHandler.error(err, req, res, next));

const port = process.env.PORT || 8000;

app.listen(port, async () => {
    console.info('\x1b[33m%s\x1b[0m', `Server Listening on port ${port}`);
});
