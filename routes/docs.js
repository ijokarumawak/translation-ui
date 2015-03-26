var express = require('express');
var router = express.Router();
var couchbase = require('couchbase');
var N1qlQuery = couchbase.N1qlQuery;

/* Connect to Couchbase Cluster */
var cluster = new couchbase.Cluster('vm.sherlock:8091');
var bucket = cluster.openBucket('translation', function(err){
	if(err) throw err;
	bucket.enableN1ql(['vm.sherlock:8093']);
});

/* GET docs listing. */
router.get('/', function(req, res, next) {
	console.log('Bucket=', bucket);
	var query = N1qlQuery.fromString('select meta(doc).id, doc.title, doc.status from translation as doc where _type = "document" order by doc.title');
	bucket.query(query, function(err, r){
		if(err) {
			res.status(500).send(bucket.queryhosts);
			return;
		}
		res.json(r);
	});
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
