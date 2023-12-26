const mongo = require('mongodb')
// const connectionUrl =  process.env.DATABASE_CONNECTION_STRING 
const connectionUrl = 'mongodb://127.0.0.1:27017/kanban'

// 'mongodb://127.0.0.1:27017/todoList'
let db

const connetToDb = async (cb) => {
    console.log('process.env.DATABASE_CONNECTION_STRING  ',process.env.DATABASE_CONNECTION_STRING)
    await mongo.MongoClient.connect(connectionUrl).then(
        (client) => {
            db = client.db()
            console.log('db connected')
            return cb()
        }
    ).catch((err) => {
        console.log('error ', err)
    })
}

const getDb = () => { return db }

module.exports = {
    connetToDb, getDb
}

