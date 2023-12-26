const express = require('express')
const app = express()
const {connetToDb, getDb} = require('./db');
const {readWriteTaskId,writeInitialTaskId, getId} = require('./generateTaskId');
const { ObjectId } = require('bson');
const cors = require('cors')
const dotenv = require('dotenv')
const {dateFormatter, verifyAccessToken } = require('./util')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
let db;
const classifyWithStatus =(result) => {
    let data = [];
    let todo, inProgress, done, today;
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
        today = result.filter(arr => {
            return arr.status == "Today"
        })
        data = [todo , inProgress, done, today ];
        return data
        
}
readWriteTaskId();
dotenv.config();
// Body parsing middleware
app.use(express.json());       // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing applicat


// apply cors middleware
app.use(cors({ origin : '*'}));

connetToDb(async ()=>{
    app.listen(8080,()=>{console.log('app is running at port 8080')})
    db = await getDb()
});


const hashedPassword = async (pwd) =>{
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(pwd , salt);
    return hashed
}

const isValidPassword = async (uiPwd, dbPwd) => {
   return await bcrypt.compare(uiPwd, dbPwd)
}

const generateToken = (data, scretKey, tokenFor) => {
    const token = jwt.sign(data, scretKey, {expiresIn : tokenFor ? '1h' : '1Y'})
    return token
}

// API routes

app.get('/tasks', 
verifyAccessToken, 
(req, res) => {

    const {groupBy, isFilter, assignee, deadLine, genre, label, priority, status, taskType} = req.query;
    if(!isFilter){
        let data;
        db.collection('tasks').find({isSofteDelete : false }).toArray().then((result) => {
            console.log('result -tasks--- ',result)
            if(groupBy == 'status') {
                data = classifyWithStatus(result);
            } else data = result
            res.status(200).json(data)
        }).catch(err => {
            console.log('err ',err)
        })
    } else {
        getFilteredTasks(req, res);
    }
})

app.get('/taskDetails/:taskId' , verifyAccessToken, (req, res) => {
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

app.post('/createTasks', verifyAccessToken, (req, res) => {
    req.body['taskId'] = getId();
    req.body['createdAt'] = new Date();
    req.body['isSofteDelete'] = req.body.hasOwnProperty('isSofteDelete') ? req.body['isSofteDelete'] : false;
    db.collection('tasks').insertOne(req.body).then((result) => {
      res.status(200).json({msg: 'The task is created successfully.'})  
    }).catch(err => {res.status(500).json(err)})

    // update the taskId in data.json file
    writeInitialTaskId(req.body['taskId']);

})

app.put('/editTasks',
//  verifyAccessToken, 
 (req, res) => {
    console.log('req.body.id  ',req.body);
    const taskId = req.body.taskId;
    const {_id, ...updateData} = req.body;
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

app.delete('/deleteTasks/:id', verifyAccessToken, (req, res) => {
    db.collection('tasks').deleteOne({_id : new ObjectId(req.params.id)})
    .then((result) => {
      res.status(200).json({msg : 'Task is deleted successfully'})  
    }).catch(err => {res.status(500).json(err)})
})

app.put('/softDelete/:id', verifyAccessToken, (req, res) => {
    db.collection('tasks')
    .updateOne({_id : new ObjectId(req.params.id) } , { $set : { isSofteDelete : true } })
    .then((result) => {
      res.status(200).json({msg : 'Task is soft deleted successfully'})  
    }).catch(err => {res.status(500).json(err)})
})

app.get('/search', verifyAccessToken, (req, res) => {
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

app.get('/deletedTasks', verifyAccessToken, (req, res) => {
    db.collection('tasks').find({isSofteDelete : true }).toArray()
    .then((result) => {
        console.log('result ', result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({err : err})
    })
})

// register new user and generate jwt token
app.post('/register' , async (req, res) => {
    const data = req.body;
    console.log('data ',data)
    console.log('data.password  ',data.password)
    data['password'] = await hashedPassword(data.password);
    data['updatedAt'] = new Date();
    console.log('data ',data);
    db.collection('users').insertOne(data).then(result => {
        console.log('inserted ',result)
        res.status(200).json({msg: 'The User is created successfully.'})  
    }).catch(err => {
        console.log('err  -- ',err)
        res.status(500).json(err)
    })
    
})

app.post('/login', async (req, res) => {
    // validate email and password
    console.log('login called')
    let user = await db.collection('users').findOne({email : req.body.email})  ;
    if(user) {
        if(await isValidPassword(req.body.password, user.password)) {
            const accessToken =  generateToken(user, process.env.SECRET_ACCESS_KEY, 'access');
            const refreshToken = generateToken(user, process.env.SECRET_REFRESH_KEY, null);
            user = {...user, ['accessToken'] : accessToken, ['refreshToken']: refreshToken , ['msg'] : 'User is logged in!'}
            res.status(200).json(user)
            } else res.status(401).json({msg : 'Wrong password'})
        } else res.status(201).json({msg : 'Invalid email'});
})

app.get('/users', (req,res) => {
    db.collection('users').find({}).toArray()
    .then((result) => {
        console.log('result ', result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({err : err})
    })
})


// Comments APIs

// add comment
app.post('/addComment', (req, res) => {
    const commentDoc = req.body;
    commentDoc['createdAt'] = new Date();
    db.collection('comments').insertOne(commentDoc)
    .then(result=> {
        res.status(200).json(result);
    }).catch(err => {
        res.status(400).json(err)
    })
})

// get comment by taskId
app.get('/getComments/:taskId', (req,res) => {
    db.collection('comments').find({taskId : req.params.taskId}).toArray().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(400).json(err)
    })
})

const getFilteredTasks = (req, res) => {
    const {groupBy, isFilter, assignee, deadLine, genre, label, priority, status, taskType} = req.query;
    console.log('assignee, deadLine, genre, label, priority, status, taskType ', req.query.assignee)
    let data;
    let filterExpression = [{isSofteDelete : false }];
    if(assignee ) {
        filterExpression.push({assignee : assignee})
    }
    if(deadLine ) {
        filterExpression.push({deadLine : { $lt : deadLine } })
    }
    if(genre ) {
        filterExpression.push({genre : genre})
    }
    if(label ) {
        filterExpression.push({label : label})
    }
    if(priority ) {
        filterExpression.push({priority : priority})
    }
    if(status ) {
        filterExpression.push({status : status})
    }
    if(taskType ) {
        filterExpression.push({taskType : taskType})
    }
   
    console.log('filterExpression  ',filterExpression)
        db.collection('tasks').find({$and : filterExpression}).toArray().then((result) => {
            console.log('result -tasks--- ',result)
            if(groupBy == 'status') {
                data = classifyWithStatus(result);
            } else data = result
            res.status(200).json(data)
        }).catch(err => {
            console.log('err ',err)
        })

}




