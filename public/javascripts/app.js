angular.module('app', ['ngRoute', 'ngClipboard'])

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

  .controller('DocCtrl',
		['$scope', '$routeParams', 'DocService',
			function ($scope, $routeParams, DocService) {
		console.log("DocCtrl is called!");
		var promise = DocService.get($routeParams.id);
		promise.then(function(result){
		  $scope.doc = result.data;
		  console.log("$scope.doc=", $scope.doc);
		});

		$scope.save = function(){
		  console.log("$scope.doc=", $scope.doc);
			var promise = DocService.save($routeParams.id, $scope.doc);
			promise.then(function(result){
			  console.log("result=", result);
			});
			console.log("Saved.");
		};

		$scope.isWindowBig = function(){
			return $(window).height() + 100 < $(document).height();
		};

		$scope.getTextToCopy = function(){
			return "hogehoge";
		};

		$scope.copiedText = function(){
			console.log("Copied.");
		};
  }])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/docs.html',
        controller: 'DocsCtrl'
      })

      .when('/:id', {
        templateUrl: '/doc.html',
        controller: 'DocCtrl'
     	})
			;
  }])

/*
// It doesn't work..
  .config(['ngClipProvider', function(ngClipProvider) {
		ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
		console.log('Configured clip path.');
	}])
*/

;

