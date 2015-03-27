angular.module('app', ['ngRoute', 'ui.router', 'ngClipboard'])

  .service('DocService', ['$http', function($http){
		this.query = function(){
			return $http.get('/docs/').then(function(data){
				console.log(data);
				return data;
			});
		}

    this.get = function(id){

			console.log("Getting a doc with id:" + id);
			return $http.get('/docs/' + id).then(function(data){
				console.log(data);
				return data;
			});
		};

    this.save = function(id, doc){

			console.log("Saving a doc with id:" + id);
			return $http.put('/docs/' + id, doc).then(function(data){
				console.log(data);
				return data;
			});
		};

    this.getSimilarSentences = function(id){

			console.log("Getting similar sentences with id:" + id);
			return $http.get('/sims/' + id).then(function(data){
				console.log(data);
				return data;
			});
		};
	}])

  .controller('DocsCtrl',
		['$scope', 'DocService',
			function ($scope, DocService) {
		console.log("DocsCtrl is called!");

    var promise = DocService.query();
		promise.then(function(result){
			$scope.docs = result.data;
		  console.log("$scope.docs=", $scope.docs);
		});
		
  }])

  .controller('RootDocCtrl',
		['$rootScope', '$scope', '$stateParams', 'DocService',
			function ($rootScope, $scope, $stateParams, DocService) {
		console.log("RootDocCtrl is called!");

		console.log("at Root:", $stateParams.docId);
		console.log($rootScope);

		var promise = DocService.get($stateParams.docId);
		promise.then(function(result){
		  $rootScope.doc = result.data;
		  console.log("$rootScope.doc=", $rootScope.doc);
		});

  }])

  .controller('DocCtrl',
		['$scope', '$stateParams', 'DocService',
			function ($scope, $stateParams, DocService) {
		console.log("DocCtrl is called!", $stateParams);

		$scope.docStatusOptions = [
			"Translating", "Translated", "Reviewing", "Reviewed", "Done"
		];

		$scope.save = function(){
		  console.log("$scope.doc=", $scope.doc);
			var promise = DocService.save($stateParams.docId, $scope.doc);
			promise.then(function(result){
			  console.log("result=", result);
			  console.log("Saved.");
			});
		};

  }])

  .controller('SentenceCtrl',
		['$scope', '$rootScope', '$stateParams', 'DocService',
			function ($scope, $rootScope, $stateParams, DocService) {
		console.log("SentenceCtrl is called!", $stateParams);

		$scope.getSimilarSentences = function(idx){
			var sentence = $rootScope.doc.sentences[idx];
			if($rootScope.sentence && $rootScope.sentence.id == sentence.id) {
				return;
			}
			$rootScope.sentence = sentence;
			var promise = DocService.getSimilarSentences(sentence.id);
			promise.then(function(result){
			  console.log("result=", result);
				$rootScope.similarSentences = result.data;
			});
		}

		$scope.getTextToCopy = function(idx){
			var sentence = $rootScope.doc.sentences[idx];
			return sentence.txt.ja;
		}

		$scope.isWindowBig = function(){
			return $(window).height() + 100 < $(document).height();
		};

  }])

  .controller('SimCtrl',
		['$scope', '$rootScope', '$stateParams', 'DocService',
			function ($scope, $rootScope, $stateParams, DocService) {
		console.log("SimCtrl is called!", $stateParams);

		$scope.copySentence = function(idx){
			var sentence = $rootScope.similarSentences[idx];
			$rootScope.sentence.txt.ja = sentence.txt.ja;
		}

  }])

	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('docs', {
			url: "/docs",
			views: {
				'north': {
					templateUrl: 'partials/not-implemented.html'
				},
				'center': {
					templateUrl: 'partials/docs.html',
          controller: 'DocsCtrl'
				},
				'south': {
					templateUrl: 'partials/not-implemented.html'
				}
			}
		});
		$stateProvider.state('doc', {
			url: "/docs/:docId",
			views: {
				'doc': {
					controller: 'RootDocCtrl'
				},
				'north': {
					templateUrl: 'partials/doc-status.html',
					controller: 'DocCtrl'
				},
				'center': {
					templateUrl: 'partials/sentences.html',
					controller: 'SentenceCtrl'
				},
				'south': {
					templateUrl: 'partials/similar-sentences.html',
					controller: 'SimCtrl'
				}
			}
		});
	}])

	.config(['ngClipProvider', function(ngClipProvider) {
		ngClipProvider.setPath("zeroclipboard-2.2.0/ZeroClipboard.swf");
	}])

	.filter('percentage', ['$filter', function ($filter) {
	  return function (input, decimals) {
	    return $filter('number')(input * 100, decimals) + '%';
	  };
	}])

	.run(['$state', function($state){
		// State can be mapped by URL as well, by '/#/url'.
		// When you access the root URL, this transition is needed.
		$state.transitionTo('docs');
	}])

;

