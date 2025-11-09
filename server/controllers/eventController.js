import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'

export async function listEvents(req, res){
  try{
    const db = getDB()
    const events = await db.collection('events').find({}).sort({ date: 1 }).toArray()
    return res.json(events)
  }catch(err){ return res.status(500).json({ message: 'Failed to list events' }) }
}

export async function createEvent(req, res){
  try{
    const db = getDB()
    const { title, organizer, date, time, location, description, link } = req.body
    if(!title || !date) return res.status(400).json({ message: 'Missing fields' })
    const doc = { title, organizer: organizer||'Unknown', date, time: time||'', location: location||'', description: description||'', link: link||'', joinedUsers: [], createdAt: new Date() }
    const { insertedId } = await db.collection('events').insertOne(doc)
    return res.status(201).json({ _id: insertedId, ...doc })
  }catch(err){ return res.status(500).json({ message: 'Failed to create event' }) }
}

export async function joinEvent(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    await db.collection('events').updateOne({ _id }, { $addToSet: { joinedUsers: req.user._id } })
    const ev = await db.collection('events').findOne({ _id })
    return res.json(ev)
  }catch(err){ return res.status(500).json({ message: 'Failed to join event' }) }
}

export async function userJoinedEvents(req, res){
  try{
    const db = getDB()
    const events = await db.collection('events').find({ joinedUsers: req.user._id }).sort({ date: 1 }).toArray()
    return res.json(events)
  }catch(err){ return res.status(500).json({ message: 'Failed to get user events' }) }
}
