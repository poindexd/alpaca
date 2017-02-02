var app = angular.module('alpacaViewer', ['alpacaTemplates', 'swiperRepeat']);


app.controller('alpacaViewerController', ['$scope', function($scope){
	$scope.survey = {

		slides: [
			{
				id: 1, title: 'Slide 1', template: 'green'
			},
			{
				id: 2, title: 'Slide 2', template: 'orange'
			},
			{
				id: 3, question: 'Testing multiple choice with image', template: 'multiplechoice', options:[{text: "one"}, {text: "two"}, {text: "three"}, {text: "four"}, {text: "five"}] 
				, image_align: "Top", image_url: 'http://i.imgur.com/t0FE1LP.jpg', content: "This is Content section"
			},
			{
				id: 4, question: 'Testing multiple choice without image', template: 'multiplechoice_sans_image', options:[{text: "one"}, {text: "two"}, {text: "three"}, {text: "four"}, {text: "five"}] 
				, content: "This is content section"
			},
			{
				id: 5, question: 'Testing Likert with image', template: 'likert', options:[{text: "Not likely"}, {text: "likely"}, {text: "very likely"}] 
				, image_align: "Top", image_url: 'http://i.imgur.com/t0FE1LP.jpg', content: "This is content section"
			},
			{
				id: 6, question: 'Testing Likert without image', template: 'likert_sans_image', options:[{text: "Not likely"}, {text: "likely"}, {text: "very likely"}] 
				, content: "This is content section"
			},
			{
				id: 7, question: 'Testing Just Plain image', template: 'image', image_align: "Top", image_url: 'http://i.imgur.com/t0FE1LP.jpg'
				, content: "This is content section"
			}


		]

	}

	$scope.selected = $scope.survey.slides[4];

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

			$templateRequest('alpaca-template-' + $scope.slide.template).then(function(tpl){
				var template = angular.element(tpl);
				element.after(template);
				$compile(template)($scope);
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
			template: "<div swiper-repeat='slide in survey.slides' swiper-repeat-selected='selected'><alpaca-slide slide='slide'/></div>"

		};
});