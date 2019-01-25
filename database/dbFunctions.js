const db = require("./dbConfig");

const dbFuncs = {
    getUsers:  () => {
        return db('users')
    },
    getUser:  (creds) => {
        return db("users")
        .where({username: creds.username})
        .first()
    },
    addUser: (userInfo) => {
        return db('users').insert(userInfo)
    }
}

module.exports = dbFuncs;
