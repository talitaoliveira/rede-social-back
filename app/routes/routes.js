var ObjectID = require('mongodb').ObjectID;
const allowCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type, Content-Length, X-Requested-With, Origin, Accept');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
}

module.exports = function (app, client) {
    let db = client.db('myDatabase');

    app.use(allowCORS);

    /**
     * ACTION GET - one
     */
    app.get('/projects/:id', (req, res) => {
        const id = req.params.id;
        console.log(new ObjectID(id))
        const details = { '_id': new ObjectID(id) };
        db.collection('projects').findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occured' });
            } else {
                if (item == null) {
                    res.send(`No registers found with the id: ${id}`);
                } else {
                    res.send(item);
                }

            }
        })
    })

    /**
     * ACTION GET - all
     */
    app.get('/projects', (req, res) => {
        db.collection('projects').find({}).toArray((err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occured' });
            } else {
                res.send(item);
            }
        })
    })

    /**
     * ACTIONS POST
     */
    app.post('/projects', (req, res) => {
        // We'll crate the project here
        const project = { 
            name: req.body.name, 
            description: req.body.description,
            volunteers: req.body.volunteers,
            location: req.body.location
         };
        db.collection('projects').insert(project, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occured' });
            } else {
                res.send(result.ops[0]);
            }
        });
    })

    /**
     * ACTION PUT
     */
    app.put('/projects/:id', (req, res) => {
        const id = req.params.id;
        console.log(new ObjectID(id))
        const details = { '_id': new ObjectID(id) };
        const project = { 
            name: req.body.name, 
            description: req.body.description,
            volunteers: req.body.volunteers,
            location: req.body.location
         };
        db.collection('projects').update(details, project, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occured' });
            } else {
                res.send(item);
            }
        })
    })

    /**
     * ACTION DELETE
     */
    app.delete('/projects/:id', (req, res) => {
        const id = req.params.id;
        console.log(new ObjectID(id))
        const details = { '_id': new ObjectID(id) };
        db.collection('projects').remove(details, (err, item) => {
            console.log(item.result.n)
            if (err) {
                res.send({ 'error': 'An error has occured' });
            } else {
                if (item.result.n == 0) {
                    res.send(`No registers found with the id: ${id}`);
                } else {
                    res.send(`Note ${id} deleted`);
                }
            }
        })
    })
}
