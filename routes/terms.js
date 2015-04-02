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

/* GET similar sentences. */
router.get('/:id', function(req, res, next) {

	bucket.get('term::' + req.params.id, function(err, r){
		if(err) {
			if(err.code == 13) res.status(200).send({});
			else res.status(500).send(err);
			return;
		}
		res.json(r.value);
	});

});

module.exports = router;
