import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'

export async function getMe(req, res){
  try{
    const db = getDB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) }, { projection: { password: 0 } })
    if(!user) return res.status(404).json({ message: 'User not found' })
    return res.json(user)
  }catch(err){ return res.status(500).json({ message: 'Failed to get user' }) }
}

export async function updateMe(req, res){
  try{
    const db = getDB()
    const { name, email } = req.body
    const upd = {}
    if(name) upd.name = name
    if(email) upd.email = email
    await db.collection('users').updateOne({ _id: new ObjectId(req.user._id) }, { $set: upd })
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) }, { projection: { password: 0 } })
    return res.json(user)
  }catch(err){ return res.status(500).json({ message: 'Failed to update user' }) }
}

export async function getMyPosts(req, res){
  try{
    const db = getDB()
    const posts = await db.collection('posts').find({ authorId: req.user._id }).sort({ createdAt: -1 }).toArray()
    return res.json(posts)
  }catch(err){ return res.status(500).json({ message: 'Failed to get posts' }) }
}

export async function getMyEvents(req, res){
  try{
    const db = getDB()
    const events = await db.collection('events').find({ joinedUsers: req.user._id }).sort({ date: 1 }).toArray()
    return res.json(events)
  }catch(err){ return res.status(500).json({ message: 'Failed to get events' }) }
}
