angular.module('alpacaViewer').directive('alpacaSlide', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			
			//if ($scope.linked)
				//return;
			//$scope.linked = true;

			if (!$scope.slide){
				//$scope.slide = {};
				//$scope.slide.template = $scope.template;
				//angular.forEach($scope.schema, function(field){
				//	$scope.slide[field.key] = field.placeholder || 'text';
				//});
			}

			$scope.$watch('slide.template', function(){
				if (!$scope.slide){
					console.error('slide is undefined');
					return false;
				}
				$templateRequest('alpaca-template-' + $scope.slide.template)
				.then(function(tpl){
					var template = angular.element(tpl);
					if ($scope.single)
						element.html(template);
					else
						element.after(template);
					$compile(template)($scope);
				})
				.catch(function(error){
					//console.log(error);
				});
			});

		}

		return {
			restrict: 'E',
			link: link,
			//replace: true,
			scope: {
				slide: '=?',
				template: '=?',
				schema: '=?',
				single: '=?'
			}
		};
}]);