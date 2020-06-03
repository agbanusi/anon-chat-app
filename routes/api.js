/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
var ID = require('shortid')
const bcrypt = require('bcrypt')
var expect = require('chai').expect;

module.exports = function (app,db) {
  app.route('/api/threads/:board')
    .post((req,res)=>{
      //console.log(req.params)
      bcrypt.hash(req.body.delete_password,13,(err,hash)=>{
        var id=ID.generate()
        db.collection('tik').insertOne({_id:id,board:req.params.board?req.params.board:req.body.board.trim(),text:req.body.text,password:hash,created_on:new Date().toUTCString(),reported:false,bumped_on:new Date().toUTCString(),replies:[]},(err,doc)=>{
          //console.log(req.body.board)
          var body=req.params.board?req.params.board:req.body.board
          res.redirect('/b/'+body+'/')
          //res.send({_id:id,board:req.body.board,text:req.body.text,created_on:new Date()})
        })
      })  
    })
   .get((req,res)=>{
    var id=req.params.board
    //console.log(id)
    db.collection('tik').find({board:id}).sort({bumped_on:-1}).limit(10).toArray((err,doc)=>{
      //console.log(doc[0])
      let docs=doc.map((i)=>{
        delete i.delete_password;
        delete i.reported
        i.replies=i.replies.reverse().slice(0,3)
        return {...i,replycount:i.replies.length}
      })
      res.send(docs)
    })
  })
    .put((req,res)=>{
      var board=req.params.board?req.params.board:req.body.board
      db.collection('tik').findOneAndUpdate({_id:req.body.thread_id},{$set:{reported:true}},(err,doc)=>{
        res.send('success')
      })
    })
    .delete((req,res)=>{
      var board=req.params.board?req.params.board:req.body.board.trim()
      db.collection('tik').findOne({_id:req.body.thread_id.trim(),board:board},(err,doc)=>{
        bcrypt.compare(req.body.delete_password,doc.password,(err,result)=>{
          if (result==true){
            db.collection('tik').deleteOne({_id:req.body.thread_id},(err,docs)=>{
              res.send('success')
            })
          }
          else{
            res.send('incorrect password')
          }
        })
      })
    })
    
  app.route('/api/replies/:board')
  .post((req,res)=>{
    var board=req.params.board?req.params.board:req.body.board.trim()
    var id=req.body.thread_id.trim()
    var Id = ID.generate()
    bcrypt.hash(req.body.delete_password,13,(err,hash)=>{
      if (err) throw err
    db.collection('tik').findOneAndUpdate({_id:id},{$set:{bumped_on:new Date().toUTCString()},$push:{replies:{_id:Id,text:req.body.text,created_on:new Date().toUTCString(),delete_password:hash,reported:false}}},(err,doc)=>{
      res.redirect('/b/'+board+'/'+id+'/')
    })})
  })
  .get((req,res)=>{
    var board=req.params.board
    var id=req.query.thread_id
    db.collection('tik').findOne({_id:id},(err,docs)=>{
      delete docs.delete_password
      delete docs.reported
      res.send(docs)
    })
  })
  .put((req,res)=>{
    var board=req.params.board?req.params.board:req.body.board.trim()
    db.collection('tik').findOne({_id:req.body.thread_id.trim()},(err,doc)=>{
      doc.replies.forEach((i)=>{
        if(i._id==req.body.reply_id){
          i.reported=true
          res.send('success')
        }
      })
    })
  })
  .delete((req,res)=>{
    var board=req.params.board?req.params.board:req.body.board.trim()
    var thread_id=req.body.thread_id.trim()
    var reply_id=req.body.reply_id.trim()
    db.collection('tik').findOne({_id:thread_id,board:board},(err,doc)=>{
      let reply=doc.replies.find((post,index)=>{
        if(post._id==reply_id){
            return true
        }
      })
      let replyInd=doc.replies.findIndex((post,index)=>{
        if(post._id==reply_id){
            return true
        }
      })
      if(replyInd>=0){
        bcrypt.compare(req.body.delete_password,reply.delete_password,(err,result)=>{
          if(result==true){
            doc.replies.splice(replyInd,1)
            db.collection('tik').findOneAndUpdate({_id:thread_id,board:board},{$set:{replies:doc.replies}},(err,docs)=>{
              res.send('success')
            })
            
          }
          else{
            res.send('incorrect password')
          }
        })
      }
      else{
        res.send('thread or reply not found!')
      }
    })
  })
//O8hyZDyqG  vkXNzNFn- voQBKbsY3
};

