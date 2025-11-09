import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

let client
let db

export async function connectDB(){
  if(db) return db
  const uri = process.env.MONGO_URI
  client = new MongoClient(uri)
  await client.connect()
  const dbName = uri.split('/').pop()
  db = client.db(dbName)
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('posts').createIndex({ createdAt: -1 }),
    db.collection('events').createIndex({ date: 1 }),
    db.collection('techtalk').createIndex({ createdAt: -1 })
  ])
  return db
}

export function getDB(){
  if(!db) throw new Error('DB not initialized')
  return db
}
