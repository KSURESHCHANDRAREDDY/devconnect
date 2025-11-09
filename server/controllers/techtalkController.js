import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'

export async function listThreads(req, res){
  try{
    const db = getDB()
    const threads = await db.collection('techtalk').aggregate([
      { $addFields: { authorObjId: { $cond: [ { $ifNull: ["$authorId", false] }, { $toObjectId: "$authorId" }, null ] } } },
      { $lookup: { from: 'users', localField: 'authorObjId', foreignField: '_id', as: 'authorUser' } },
      { $addFields: {
          author: { $ifNull: [ '$author', { $arrayElemAt: [ '$authorUser.name', 0 ] } ] },
          authorPic: { $ifNull: [ '$authorPic', { $arrayElemAt: [ '$authorUser.avatar', 0 ] } ] }
        }
      },
      { $unwind: { path: '$replies', preserveNullAndEmptyArrays: true } },
      { $addFields: { replyUserObjId: { $cond: [ { $ifNull: ["$replies.userId", false] }, { $toObjectId: "$replies.userId" }, null ] } } },
      { $lookup: { from: 'users', localField: 'replyUserObjId', foreignField: '_id', as: 'replyUser' } },
      { $addFields: {
          'replies.userName': { $ifNull: [ '$replies.userName', { $arrayElemAt: [ '$replyUser.name', 0 ] } ] },
          'replies.userPic': { $ifNull: [ '$replies.userPic', { $arrayElemAt: [ '$replyUser.avatar', 0 ] } ] }
        }
      },
      { $group: { _id: '$_id', doc: { $first: '$$ROOT' }, replies: { $push: '$replies' } } },
      { $addFields: { 'doc.replies': { $filter: { input: '$replies', as: 'r', cond: { $ne: ['$$r', null] } } } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $project: { authorUser: 0, replyUser: 0, authorObjId: 0, replyUserObjId: 0 } },
      { $sort: { createdAt: -1 } }
    ]).toArray()
    res.json(threads)
  }catch(err){ res.status(500).json({ message: 'Failed to list discussions' }) }
}

export async function createThread(req, res){
  try{
    const db = getDB()
    const { title, body } = req.body
    if(!title || !body) return res.status(400).json({ message: 'Missing fields' })
    const doc = { authorId: req.user._id, author: req.user.name || 'User', authorPic: req.user.avatar || '', title, body, replies: [], likes: [], dislikes: [], createdAt: new Date() }
    const { insertedId } = await db.collection('techtalk').insertOne(doc)
    res.status(201).json({ _id: insertedId, ...doc })
  }catch(err){ res.status(500).json({ message: 'Failed to create discussion' }) }
}

export async function getThread(req, res){
  try{
    const db = getDB()
    const t = await db.collection('techtalk').findOne({ _id: new ObjectId(req.params.id) })
    if(!t) return res.status(404).json({ message: 'Not found' })
    res.json(t)
  }catch(err){ res.status(500).json({ message: 'Failed to get discussion' }) }
}

export async function replyThread(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    const { text } = req.body
    if(!text) return res.status(400).json({ message: 'Missing text' })
    const reply = { userId: req.user._id, userName: req.user.name || 'User', userPic: req.user.avatar || '', text, createdAt: new Date() }
    await db.collection('techtalk').updateOne({ _id }, { $push: { replies: reply } })
    const t = await db.collection('techtalk').findOne({ _id })
    res.json(t)
  }catch(err){ res.status(500).json({ message: 'Failed to reply' }) }
}

export async function likeThread(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    await db.collection('techtalk').updateOne({ _id }, { $addToSet: { likes: req.user._id }, $pull: { dislikes: req.user._id } })
    const t = await db.collection('techtalk').findOne({ _id })
    res.json(t)
  }catch(err){ res.status(500).json({ message: 'Failed to like discussion' }) }
}

export async function dislikeThread(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    await db.collection('techtalk').updateOne({ _id }, { $addToSet: { dislikes: req.user._id }, $pull: { likes: req.user._id } })
    const t = await db.collection('techtalk').findOne({ _id })
    res.json(t)
  }catch(err){ res.status(500).json({ message: 'Failed to dislike discussion' }) }
}

export async function deleteThread(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    const t = await db.collection('techtalk').findOne({ _id })
    if(!t) return res.status(404).json({ message: 'Not found' })
    if(String(t.authorId) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    await db.collection('techtalk').deleteOne({ _id })
    return res.json({ ok: true })
  }catch(err){ return res.status(500).json({ message: 'Failed to delete discussion' }) }
}
