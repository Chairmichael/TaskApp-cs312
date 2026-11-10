import express from 'express';
import './db/Schema.js';
import taskRoutes from './routes/TaskRoutes.js'

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/tasks', taskRoutes);

app.listen(3000);