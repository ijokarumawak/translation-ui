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
	bucket.get('sim::' + req.params.id, function(err, r){
		if(err) {
			if(err.code == 13) res.status(200).send([]);
			else res.status(500).send(err);
			return;
		}
		var sims = r.value.sims;
		var simIds = new Array();
		var simMap = {};
		for(var i = 0; i < sims.length; i++){
			simIds.push(sims[i].id);
			simMap[sims[i].id] = sims[i].sim;
		}
		var queryStr = 
		"select sents.* from translation as docs"
		+ " unnest docs.sentences as sents"
		+ " where docs._type = 'document'"
		+ " and sents.id in [" + simIds + "]";

		var query = N1qlQuery.fromString(queryStr);
		bucket.query(query, function(err, r){
			if(err) {
				res.status(500).send(bucket.queryhosts);
				return;
			}
			for(var i = 0; i < r.length; i++){
				r[i]['sim'] = simMap[r[i].id];
			}
			// Descending sort.
			r.sort(function(a, b){
				if(a.sim < b.sim){
				 	return 1;
				} else if (a.sim > b.sim){
				 	return -1;
				} else {
					// If similarity is the same, prioritize which has translated text.
					if(! a.txt.ja && b.txt.ja){
					 	return 1;
					} else if(a.txt.ja && ! b.txt.ja){
					 	return -1;
					} else {
						return 0;
					}
				}
			});
			res.json(r);
		});

	});

});

module.exports = router;
