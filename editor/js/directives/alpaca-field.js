angular.module('alpacaEditor').directive('alpacaField', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			//console.log($scope.type)
			if (!$scope.type){
				console.error('undefined type', $scope);
				return false;
			}
			$templateRequest('alpaca-type-' + $scope.type).then(function(tpl){
				var template = angular.element(tpl);
				element.html(template);
				$compile(template)($scope);
			});
		}

		return {
			restrict: 'E',
			link: link,
			scope: {
				model: '=',
				type: '=',
				field: '=',
				fn: '=',
				slide: '=',
				templates: '='
			}
		};
}]);