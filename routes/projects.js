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

/* GET projects listing. */
router.get('/', function(req, res, next) {
	console.log('Bucket=', bucket);
	var query = N1qlQuery.fromString('select meta(pj).id, pj.name from translation as pj where _type = "project" order by pj.name');
	bucket.query(query, function(err, r){
		if(err) {
			res.status(500).send(bucket.queryhosts);
			return;
		}
		res.json(r);
	});
});

/* Get documents within a project */
router.get('/:id', function(req, res, next) {
	console.log('Bucket=', bucket);
	var pjid = req.params.id;
	// TODO: Use prepared statement instead of concatenating strings.
	var query = N1qlQuery.fromString('select meta(doc).id, doc.title, doc.status, doc._updatedAt from translation as doc where _type = "document" and doc.project = "' + pjid + '" order by doc.title');
	bucket.query(query, function(err, r){
		if(err) {
			res.status(500).send(bucket.queryhosts);
			return;
		}
		res.json(r);
	});
});


module.exports = router;
