angular.module('app', ['ngRoute', 'ngClipboard'])

  .service('DocService', ['$http', function($http){
		this.query = function(){
    return [
      { id: 1, name: 'AngularJS Directives', completed: true, note: 'add notes...', sentences: [
				{seq: 0, txt: {en: 'It is sunny today.', ja: '今日は天気が良い。'}},
				{seq: 1, txt: {en: 'It was sunny lastweek.'}},
				{seq: 2, txt: {en: 'It was sunny lastweek.'}},
				{seq: 3, txt: {en: 'It was sunny lastweek.'}},
				{seq: 4, txt: {en: 'It was sunny lastweek.'}},
				{seq: 5, txt: {en: 'It was sunny lastweek.'}},
				{seq: 6, txt: {en: 'It was sunny lastweek.'}},
				{seq: 7, txt: {en: 'It was sunny lastweek.'}},
				{seq: 8, txt: {en: 'It was sunny lastweek.'}},
				{seq: 9, txt: {en: 'It was sunny lastweek.'}},
				{seq: 10, txt: {en: 'It was sunny lastweek.'}},
				{seq: 11, txt: {en: 'It was sunny lastweek.'}}
			] },
      { id: 2, name: 'Data binding', completed: true, note: 'add notes...' },
      { id: 3, name: '$scope', completed: true, note: 'add notes...' },
      { id: 4, name: 'Controllers and Modules', completed: true, note: 'add notes...' },
      { id: 5, name: 'Templates and routes', completed: true, note: 'add notes...' },
      { id: 6, name: 'Filters and Services', completed: false, note: 'add notes...' },
      { id: 7, name: 'Get started with Node/ExpressJS', completed: false, note: 'add notes...' },
      { id: 8, name: 'Setup MongoDB database', completed: false, note: 'add notes...' },
      { id: "document", name: 'Be awesome!', completed: false, note: 'add notes...' },
    ];
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
    $scope.docs = DocService.query();
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

