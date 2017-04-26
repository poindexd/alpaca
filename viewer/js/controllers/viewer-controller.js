angular.module('alpacaViewer')
.controller('alpacaViewerController', [
	'$scope',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	function(
		$scope,
		$timeout,
		$firebaseObject,
		$firebaseArray){

		$scope.init = function(){
			var ref = firebase.database().ref('/slides').orderByChild('collectionId').equalTo('-KfhJ-aE_q3Hinv_qpiS');
			$scope.slides = $firebaseArray(ref);

			$scope.index = 0;
			$scope.selected = $scope.slides[0];
		}

		$scope.init();

		$scope.submit = function(){

			$scope.result['collectionId'] = '-KfhJ-aE_q3Hinv_qpiS';
			$scope.result['timestamp'] = new Date().getDate();
			var ref = firebase.database().ref('results');
			ref.push(JSON.parse(angular.toJson($scope.result))).then(function(){
				console.log('results submitted', angular.toJson($scope.result))
			})
		}

		$scope.result = {};

		$scope.fn = {
			next: function(timeout){

				if ($scope.index == $scope.slides.length - 1){
					console.log('submitting');
					$scope.submit();
					return;
				}

				$timeout(function(){
					$scope.index = Math.min($scope.index + 1, $scope.slides.length - 1);
					$scope.selected = $scope.slides[$scope.index];
				}, timeout)
			},
			previous: function(timeout){
				$timeout(function(){
					$scope.index = Math.max($scope.index - 1, 0);
					$scope.selected = $scope.slides[$scope.index];
				}, timeout || 0);
			},
			result: function(key, value, slide){
				console.log(key, value, slide);

				if(slide){
					$scope.result[slide.$id] = $scope.result[slide.$id] || {};
					$scope.result[slide.$id][key] = value;
				}else{
					$scope.result[key] = value;
				}
			}
		};

}]);
