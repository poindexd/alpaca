var app = angular.module('alpacaViewer', ['alpacaTemplates', 'swiperRepeat']);


app.controller('alpacaViewerController', ['$scope', function($scope){
	$scope.survey = {

		slides: [
			{
				id: 1, title: 'Slide 1', template: 'green'
			},
			{
				id: 2, title: 'Slide 2', template: 'orange'
			}
		]

	}

	$scope.selected = $scope.survey.slides[0];

}]);

app.directive('alpacaViewer', function() {
	return {
		restrict: 'E',
		templateUrl: 'alpaca-template-index',
		scope: {
			survey: '=',
			selected: '='
		}
	};
});

app.directive('alpacaSlide', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			
			if ($scope.linked)
				return;
			$scope.linked = true;

			if (!$scope.slide){
				$scope.slide = {};
				$scope.slide.template = $scope.template;
				angular.forEach($scope.schema, function(field){
					$scope.slide[field.key] = field.placeholder || 'text';
				})
			}

			$scope.$watch('slide.template', function(){
				$templateRequest('alpaca-template-' + $scope.slide.template).then(function(tpl){
					var template = angular.element(tpl);
					element.html(template);
					$compile(template)($scope);
				});
			});

		}

		return {
			restrict: 'E',
			link: link,
			replace: true,
			scope: {
				slide: '=?',
				template: '=?',
				schema: '=?'
			}
		};
}]);

app.directive('alpacaSlides', 
	function() {

		return {
			restrict: 'E',
			replace: true,
			//template: "<div swiper-repeat='slide in survey.slides' swiper-repeat-selected='selected'><alpaca-slide slide='slide'/></div>"
			template: "<div style='width:100%'><alpaca-slide slide='selected'/></div>"

		};
});