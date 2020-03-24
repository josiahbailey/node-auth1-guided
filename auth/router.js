const bcrypt = require('bcryptjs')

const router = require('express').Router()

const Users = require('../users/users-model')

router.post('/register', (req, res) => {
  const userInfo = req.body
  // the password will be hashed and re-hashed 2 ^ 8 times
  const ROUNDS = process.env.HASHING_ROUNDS || 8
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS)

  userInfo.password = hash

  Users.add(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => res.send(err))

})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  // the password will be hashed and re-hashed 2 ^ 8 times

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // remember the client
        req.session.user = {
          id: user.id,
          username: user.username
        }

        res.status(201).json({ message: `hello ${user.username}` })
      } else {
        res.status(401).json({ message: 'invalid username or password' })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "error finding the user" })
    })

  Users.add(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => res.send(err))

})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: 'You can checkout.. but you can never leave.' })
      } else {
        res.status(200).json({ message: 'logged out successfully ' })
      }
    })
  } else {
    res.status(200).json({ message: 'WHO EVEN ARE YOU' })
  }
})

module.exports = router