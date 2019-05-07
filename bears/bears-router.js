const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  uesNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears)
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

router.get('/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .first()
    .then(bear => {
      if (bear) {
        res.status(200).json(bear)
      } else {
        res.status(404).json({ message: 'Bear ID cannot be found.' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

router.post('/', (req, res) => {
  db('bears')
    .insert(req.body)
    .then(bear => {
      const [id] = bear;
      db('bears')
        .where({ id })
        .first()
        .then(bear => {
          res.status(200).json(bear)
        })
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

router.put('/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('bears')
          .where({ id: req.params.id })
          .first()
          .then(bear => {
            res.status(200).json(bear)
          })
      } else {
        res.status(404).json({ message: 'Bear ID could not be found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

router.delete('/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end()
      } else {
        res.status(404).json({ message: 'Bear ID could not be found.' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' })
    })
})

module.exports = router;