require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

allUrl = []
app.post('/api/shorturl', (req, res) => {
  url = req.body.url;
  const pattern = /^(http|https):\/\//i;
  if (pattern.test(url)) {
    const hostname = new URL(url).hostname;
    dns.lookup(hostname, (error, address, family) => {
      if (error) {
        res.json({"error": "Invalid Hostname"});
      }
      else {
        index = allUrl.indexOf(url);
        if (index == -1) {
          allUrl.push(url);
          res.json({"original_url": url, "short_url": allUrl.length - 1});
        }
        else {
          res.json({"original_url": url, "short_url": index})
        }
      }
    });  
  } 
  else {
    res.json({ 'error': 'invalid url' })
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  id = +req.params.id;
  if (isNaN(id)) {
    res.json({"error": "Wrong format"});
  }
  else {
    if (Number.isInteger(id) && id >=0 && id < allUrl.length) {
      res.redirect(allUrl[id]);
    }
    else {
      res.json({"error":"No short URL found for the given input"});
    }
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
