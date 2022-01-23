const express = require('express');
const expressHotwire = require('express-hotwire').default;
const formidable = require('express-formidable');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();

app.use(expressHotwire());
app.use(formidable());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/api/messages', async (req, res) => {
  const { title, body } = req.fields;

  const message = {
    id: uuidv4(),
    title,
    body
  }

  // Make sure the first argument matches the HTML element id that you want to append a child to
  await res.turboStream.append('messages', {
    partial: 'messages/show',
    locals: {
      message
    },
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000'));
