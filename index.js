const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}

const db = knex(knexConfig);

// GET all zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo)
      } else {
        res.status(404).json({ message: 'Zoo ID cannot be found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(zoo => {
      const [id] = zoo;
      db('zoos')
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo)
        })
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('zoos')
          .where({ id: req.params.id })
          .first()
          .then(zoo => {
            res.status(200).json(zoo)
          })
      } else {
        res.status(404).json({ message: 'Zoo ID not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

const port = 3300;
server.listen(port, function () {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
