import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'

export async function getPosts(req, res){
  try{
    const db = getDB()
    const posts = await db.collection('posts').aggregate([
      { $addFields: { authorObjId: { $cond: [ { $ifNull: ["$authorId", false] }, { $toObjectId: "$authorId" }, null ] } } },
      { $lookup: { from: 'users', localField: 'authorObjId', foreignField: '_id', as: 'authorUser' } },
      { $addFields: {
          author: { $ifNull: [ '$author', { $arrayElemAt: [ '$authorUser.name', 0 ] } ] },
          authorPic: { $ifNull: [ '$authorPic', { $arrayElemAt: [ '$authorUser.avatar', 0 ] } ] }
        }
      },
      { $project: { authorUser: 0, authorObjId: 0 } },
      { $sort: { createdAt: -1 } }
    ]).toArray()
    return res.json(posts)
  }catch(err){ return res.status(500).json({ message: 'Failed to get posts' }) }
}

export async function createPost(req, res){
  try{
    const db = getDB()
    const { title, description, image, tags } = req.body
    if(!title || !description) return res.status(400).json({ message: 'Missing fields' })
    const doc = {
      authorId: req.user._id,
      author: req.user.name || 'User',
      authorPic: req.user.avatar || '',
      title,
      description,
      image: image || '',
      tags: Array.isArray(tags)? tags : [],
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date()
    }
    const { insertedId } = await db.collection('posts').insertOne(doc)
    return res.status(201).json({ _id: insertedId, ...doc })
  }catch(err){ return res.status(500).json({ message: 'Failed to create post' }) }
}

export async function likePost(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    const uid = req.user._id
    await db.collection('posts').updateOne(
      { _id },
      { $addToSet: { likes: uid }, $pull: { dislikes: uid } }
    )
    const post = await db.collection('posts').findOne({ _id })
    return res.json(post)
  }catch(err){ return res.status(500).json({ message: 'Failed to like post' }) }
}

export async function dislikePost(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    const uid = req.user._id
    await db.collection('posts').updateOne(
      { _id },
      { $addToSet: { dislikes: uid }, $pull: { likes: uid } }
    )
    const post = await db.collection('posts').findOne({ _id })
    return res.json(post)
  }catch(err){ return res.status(500).json({ message: 'Failed to dislike post' }) }
}

export async function commentPost(req, res){
  try{
    const db = getDB()
    const _id = new ObjectId(req.params.id)
    const { text } = req.body
    if(!text || !String(text).trim()) return res.status(400).json({ message: 'Missing text' })
    const comment = {
      userId: req.user._id,
      userName: req.user.name || 'User',
      userPic: req.user.avatar || '',
      text: String(text).trim(),
      createdAt: new Date()
    }
    await db.collection('posts').updateOne({ _id }, { $push: { comments: comment } })
    const post = await db.collection('posts').findOne({ _id })
    return res.json(post)
  }catch(err){ return res.status(500).json({ message: 'Failed to add comment' }) }
}
