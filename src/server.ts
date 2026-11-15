import express from 'express';
import './db/Schema.js';
import taskRoutes from './routes/TaskRoutes.js';
import userRoutes from './routes/UserRoutes.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/tasks', taskRoutes);
app.use('/auth', userRoutes);

app.listen(3000);
