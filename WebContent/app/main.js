(function(k4) {
	var app = angular.module('app', ['ngResource']);
	
	app.factory('Util', ['$resource', function($resource) {
		return {
			ajax: {
				User: $resource(null, null, {
					all: {url: 'http://localhost:8080/', method: 'GET', isArray: true},
					add: {url: 'http://localhost:8080/', method: 'POST'}
				}),
				D3sample: $resource(null, null, {
					circleElem: {url: 'http://localhost:8080/circleElem', method: 'GET'},
					colorElem: {url: 'http://localhost:8080/colorElem', method: 'GET'}
				})
			}
		};
	}]);
	
	app.controller('testController', ['$scope', 'Util', '$q', function($scope, Util, $q) {
		$scope.test1 = 'now';
		$scope.newUser = {id: null, name: ''};
		$scope.add = function() {
			event.preventDefault();
			
			Util.ajax.User.add(null, $scope.newUser, function(ret) {
				console.log(ret);
				$scope.userLoad();
			}, function(err) {
				console.log(err);
			});
		};
		
		var loadColor = function() {
			var deferred = $q.defer();
			var colorAry = [];
			for (var i=0; i<3; i++) {
				Util.ajax.D3sample.colorElem(function(data) {
					colorAry.push(data.data);
					if (colorAry.length == 3) {
						deferred.resolve(colorAry);
					}
				});
			}
			return deferred.promise;
		};
		
		var loadCircle = function (){
			var deferred = $q.defer();
			var dataAry = [];
			for (var i=0; i<3; i++) {
				Util.ajax.D3sample.circleElem(function(data) {
					dataAry.push(data.data);
					if (dataAry.length == 3) {
						deferred.resolve(dataAry);
					}
				});
			}
			return deferred.promise;
		};
		
		$scope.test = 'Hello World!';
		$scope.userLoad = function() {
			Util.ajax.User.all(function(data) {
				console.log(data);
				$scope.data = data;
			});
		};
		$scope.userLoad();
		
		var svg = d3.select('#example').append('svg').attr({width: '640', height: '480'});
		$scope.load = function() {
			$q.all({'circle': loadCircle(), 'color': loadColor()}).then(function(data) {
				svg.append('circle').attr({'cx': data['circle'][0] * ((Math.random() * 6) + 1), 'cy': data['circle'][1] * (Math.random() * 4) + 1, 'r': data['circle'][2]}).style("fill",function() {
					return "rgb(" + data['color'][0] + ', ' + data['color'][1] + ', ' + data['color'][2] + ')';
			    });
			});
		};
		$scope.load();
	}]);
//	
//	app.directive('AutoAdjust', [function () {
//		return {
//			restrict: 'A',
//			scope: {
//				data: '@'
//			},
//			link: function(scope, attrs, elem, ctrl) {
//				console.log('test');
//			}
//		};
//	}]);
	
})(window.app || (window.app = {}));