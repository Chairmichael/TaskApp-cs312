import express from 'express';
import session from 'express-session';
import './db/Schema.js';
import taskRoutes from './routes/TaskRoutes.js';
import userRoutes from './routes/UserRoutes.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'dev-secret',
    resave: false,
    saveUninitialized: false,
}));

// make the logged-in user available in every EJS view
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
});

app.use('/tasks', taskRoutes);
app.use('/', userRoutes);

app.listen(3000);
