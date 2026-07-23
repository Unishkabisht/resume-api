const express = require('express');
const routes = require('./routes');

const sequelize = require('./configuration/database');
const User = require('./models/user');
const Resume = require('./models/resume');

User.associate({ User, Resume });
Resume.associate({ User, Resume });

const app = express();
app.use(express.json());
app.use('/api', routes);

async function start() {
    await sequelize.sync();
    app.listen(3000, () => console.log('Server is running on port 3000'));
}

start();