import express from 'express';
import session from 'express-session';
import './db/Schema.js';
import * as Tasks from './models/TaskModel.js';
import * as Users from './models/UserModel.js';
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
    res.locals.user = req.session.userId
        ? Users.findByEmail(req.session.userId) ?? null
        : null;
    next();
});

app.use('/tasks', taskRoutes);
app.use('/', userRoutes);

console.log('Users:');
console.table(Users.findAll());
console.log('Tasks:');
console.table(Tasks.findAll());

app.listen(3000);
