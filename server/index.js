const express = require('express');
const expressHotwire = require('express-hotwire').default;
const formidable = require('express-formidable');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

const messageRouter = require("./routes/messages");

app.use(expressHotwire());
app.use(formidable());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', messageRouter);

app.listen(3000, () => console.log('Example app listening on port 3000'));
