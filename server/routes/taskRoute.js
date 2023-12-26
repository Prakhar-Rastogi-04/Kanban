const router = require('express').Router();
const { ObjectId } = require('bson');
const {dateFormatter } = require('../util')
const {writeInitialTaskId, getId} = require('../generateTaskId');



const classifyWithStatus =(result) => {
    let data = [];
    let todo, inProgress, done;
        todo = result.filter(arr => {
            // if(arr.isSofteDelete && arr.isSofteDelete )
            return arr.status == "To Do"
        })
        inProgress = result.filter(arr => {
            return arr.status == "In Progress"
        })
        done = result.filter(arr => {
            return arr.status == "Done"
        })
        data = [{"todo" : todo} , {inProgress: inProgress}, {done : done}];
        return data
        
}

// API routes
router.get('/tasks', (req, res) => {
    const {groupBy, sortBy} = req.query;
    let data;
    db.collection('tasks').find({isSofteDelete : false }).toArray().then((result) => {
        if(groupBy == 'status') {
            data = classifyWithStatus(result);
        } else data = result
        res.status(200).json(data)
    }).catch(err => {
        console.log('err ',err)
    })
})

router.get('/taskDetails/:taskId' , (req, res) => {
    const params = req.params.taskId;
    const id = params.substring(params.indexOf('-')+1) ;
    db.collection('tasks').find({taskId : id}).toArray().then((result) => {
        result.createdAt = dateFormatter(result.createdAt);
        console.log('result ', result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({err : err})
    })
})

router.post('/createTasks', (req, res) => {
    req.body['taskId'] = getId();
    req.body['createdAt'] = new Date();
    req.body['isSofteDelete'] = req.body.hasOwnProperty('isSofteDelete') ? req.body['isSofteDelete'] : false;
    db.collection('tasks').insertOne(req.body).then((result) => {
      res.status(200).json({msg: 'The task is created successfully.'})  
    }).catch(err => {res.status(500).json(err)})

    // update the taskId in data.json file
    writeInitialTaskId(req.body['taskId']);

})

router.put('/editTasks', (req, res) => {
    console.log('req.body.id  ',req.body.taskId);
    const taskId = req.body.taskId;
    const updateData = req.body;
    console.log('updateData   ',updateData)
    db.collection('tasks').updateOne({taskId : taskId}, {$set : updateData})
    .then((result) => {
      console.log('result   ',result)
      if(result.modifiedCount===0){
        res.status(200).json({msg:'no updates available', updation:false})
      } else {
        res.status(200).json({msg : 'Updation was successfull', updation:true}) 
      }  
    }).catch(err => {
        console.log('err ',err)
        res.status(500).json({msg : err})
    })
})

router.delete('/deleteTasks/:id', (req, res) => {
    db.collection('tasks').deleteOne({_id : new ObjectId(req.params.id)})
    .then((result) => {
      res.status(200).json({msg : 'Task is deleted successfully'})  
    }).catch(err => {res.status(500).json(err)})
})

router.put('/softDelete/:id', (req, res) => {
    db.collection('tasks')
    .updateOne({_id : new ObjectId(req.params.id) } , { $set : { isSofteDelete : true } })
    .then((result) => {
      res.status(200).json({msg : 'Task is soft deleted successfully'})  
    }).catch(err => {res.status(500).json(err)})
})

router.get('/search', (req, res) => {
    console.log(req.query.search)
    db.collection('tasks').createIndex({subjectLine : 'text', description : 'text',taskId: 'text' });
    db.collection('tasks').find({ $text : { $search : req.query.search } })
    .toArray().then((result) => {
        console.log('result ', result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({err : err})
    })
})

router.get('/deletedTasks', (req, res) => {
    db.collection('tasks').find({isSofteDelete : true }).toArray()
    .then((result) => {
        console.log('result ', result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({err : err})
    })
})


module.exports = router