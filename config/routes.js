const axios = require('axios');
const bcrypt = require("bcryptjs");
const db = require("../database/dbFunctions");
const { authenticate,generateToken } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 12);
  userInfo.password = hash;
  try {
    const response = await db.addUser(userInfo);
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

}

async function login(req, res) {
  const creds = req.body;
  try {
    const user = await db.getUser(creds);
    if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`,token });
    } else {
      res
        .status(401)
        .json({ message: `Username and/or password are incorrect` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Server error`, error: err });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
