const fs = require('fs');
const filepath = 'data.json';
const initialTaskId = '0000';
const readWriteTaskId = () => {
    fs.access(filepath , fs.constants.F_OK, (err) => {
        if (err) {
            console.log("file doesnt exist");
            return ;
        }

        fs.readFile(filepath, 'utf-8' , (readErr, data) => {
            if(readErr) {
                console.log('Can not read this file');
                return ;
            } else if(data.trim() === '') {
                console.log('file is empty');
                // call file write here
                writeInitialTaskId(initialTaskId);
            } else {
                console.log('caling get task id')
            }
        })
    })
};


const writeInitialTaskId = (taskId) => {
    const dataToSave = {
        "taskId" : taskId
    }
    fs.writeFile(filepath,JSON.stringify(dataToSave), (writeErr) => {
        if(writeErr){
            console.log('error while wrting into the file ', writeErr);
            return ;
        }
    })
};

const getTaskId = () => {
    let fileData;
    try {
        fileData = JSON.parse( fs.readFileSync(filepath, 'utf-8') ).taskId;
    } catch(err) {
        console.log('unable to read the file due to error ', err);
        fileData = null
    }
    return fileData;
};

const formatId = (id) => {
    let val = id.toString(),
        valSplit = val.split('');
    if(valSplit.length < 4){
        var valArray = [];
        for(let i=4; i>val.split('').length; i--){
            valArray.push('0'); 
        }
        valArray.push(...valSplit)
    }
    return valArray.join('')
}

const getId = () => { 
    let val = parseInt(getTaskId());
    return formatId(val+1)
}



module.exports = {
    readWriteTaskId,
    writeInitialTaskId,
    getId
}