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
				id: 3, question: 'Multiple choice with image', template: 'multiplechoice', options:[{text: "A"}, {text: "B"}, {text: "C"}, {text: "D"}, {text: "E"}] 
				, image_align: "Left", image_url: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.', content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
			},
			{
				id: 4, question: 'Multiple choice without image', template: 'multiplechoice_sans_image', options:[{text: "A"}, {text: "B"}, {text: "C"}, {text: "D"}, {text: "E"}] 
				, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nibh eros, placerat a vulputate quis, faucibus quis risus."
			},
			{
				id: 5, question: 'Likert with image', template: 'likert', options:[{text: "strongly agree"}, {text: "agree"}, {text: "neutral"}, {text: "disagree"}, {text: "strongly disagree"}] 
				, image_align: "Left", image_url: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.', content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
			},
			{
				id: 6, question: 'Likert without image', template: 'likert_sans_image', options:[{text: "strongly agree"}, {text: "agree"}, {text: "neutral"}, {text: "disagree"}, {text: "strongly disagree"}] 
				, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nibh eros, placerat a vulputate quis, faucibus quis risus."
			},
			{
				id: 7, question: 'Testing Just Plain image', template: 'image', image_align: "Top", image_url: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.'
				, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nibh eros, placerat a vulputate quis, faucibus quis risus."
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