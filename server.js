const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schema/schema');
const app = express();

app.use(cors());

const config = {
    dbUser: "avdemeisen",
    dbPassword: "wheredoyoubelongTHEPAST8080"
}

const mongoUri = `mongodb://${config.dbUser}:${config.dbPassword}@ds057954.mlab.com:57954/brain-bog-db`;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('connected to db');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port;
    console.log("app running on port", port);
});