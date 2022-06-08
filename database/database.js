const Datastore = require("@seald-io/nedb");

var db = {}

db.log = new Datastore({ filename: 'database/logs.db', autoLoad: true });
db.log.loadDatabase();

function throwError(info = "not specified") {
    console.log(`Database internal error at ${info}`);
}

// returns all entries, sorted by date like so: 31th, 30th, 29th etc.
const getAll = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log("Trying to find docs...");
            db.log.find({}).sort({date: -1}).exec(function(err, docs) {
                if(docs.length == 0) {
                    console.log("No docs found!");
                    resolve([]);
                } else {
                    console.log("Returning found docs..");
                    resolve(docs);
                }
                if(err) {
                    throwError(err);
                    //reject(err);
                }
            })
        }
        catch (e) {
            throwError(e);
            //reject(e);
        }
    })
}

const saveDoc = (doc) => {
    return new Promise((resolve, reject) => {
        db.log.insert(doc, function (err, newDoc) {
            if(err) {
                throwError(err);
            } else {
                resolve(newDoc);
            }
        })
    })
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        db.log.find({ _id: id }, async function(err, docs) {
            docs = docs[0];
            resolve(docs);
        })
    })
}

const hasObject = (id) => {
    return new Promise((resolve, reject) => {
        db.log.find({ _id: id }, async function(err, docs) {
            if(docs.length == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

const updateEntry = (entry) => {
    return new Promise(async (resolve, reject) => {

        entry = JSON.parse(entry);

        // ID is (year + month + day);
            const date = new Date(entry.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
        const id = `${year}${month}${day}`;

        let newObj = {
            date: entry.date,
            timeInSeconds: entry.timeInSeconds,
            _id: id,
        }

        const hasObj = await hasObject(id);

        if(hasObj) { 
            // update

            // get old object
            const oldObj = await findId(id);

            newObj.timeInSeconds = parseInt(oldObj.timeInSeconds) + parseInt(entry.timeInSeconds);

            db.log.update({ _id: id }, newObj, {}, async function (err, docsUpdated) {
                if(err) {
                    throwError(err);
                } else {
                    resolve(newObj);
                    db.log.compactDatafile();
                    return;
                }
            })
        } else {
            // insert new
            console.log("Inserting new...");
            const res = await saveDoc(newObj);
            resolve(res);
        }
    })
}

export { getAll, saveDoc, updateEntry}