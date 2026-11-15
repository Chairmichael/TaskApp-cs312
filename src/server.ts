import express from 'express';
import './db/Schema.js';
import taskRoutes from './routes/TaskRoutes.js'
import loginRoutes from './routes/LoginRoutes.js'

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/tasks', taskRoutes);
app.use('/', loginRoutes)


app.listen(3000);