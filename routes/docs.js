var express = require('express');
var router = express.Router();
var couchbase = require('couchbase');

/* Connect to Couchbase Cluster */
var cluster = new couchbase.Cluster('vm.sherlock:8091');
var bucket = cluster.openBucket('translation', function(err){
	if(err) throw err;
});

/* GET docs listing. */
router.get('/', function(req, res, next) {
		console.log('Bucket=', bucket);
    var docs = [
      { id: 1, name: 'AngularJS Directives', completed: true, note: 'add notes...' },
      { id: 2, name: 'Data binding', completed: true, note: 'add notes...' },
      { id: 3, name: '$scope', completed: true, note: 'add notes...' },
      { id: 4, name: 'Controllers and Modules', completed: true, note: 'add notes...' },
      { id: 5, name: 'Templates and routes', completed: true, note: 'add notes...' },
      { id: 6, name: 'Filters and Services', completed: false, note: 'add notes...' },
      { id: 7, name: 'Get started with Node/ExpressJS', completed: false, note: 'add notes...' },
      { id: 8, name: 'Setup MongoDB database', completed: false, note: 'add notes...' },
      { id: "document", name: 'Be awesome!', completed: false, note: 'add notes...' },
    ];
	res.json(docs);
});

/* Get specific document */
router.get('/:id', function(req, res, next) {
	bucket.get(req.params.id, function(err, r){
		if(err) {
			res.status(500).send(err);
			return;
		}
		res.json(r.value);
	});
});

/* Update existing document */
router.put('/:id', function(req, res, next) {
	bucket.upsert(req.params.id, req.body, function(err, r){
		if(err) {
			res.status(500).send(err);
			return;
		}
		res.status(200).send({msg: 'saved.'});
	});
});

module.exports = router;
