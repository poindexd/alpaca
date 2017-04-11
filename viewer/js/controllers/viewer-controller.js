angular.module('alpacaViewer')
.controller('alpacaViewerController', [
	'$scope',
	'$timeout',

	function($scope, $timeout){

		$scope.survey = {

			slides: [
				// {
				// 	//id: 1, template: 'index'
				// }
				// ,
				{
					id: 2, template: 'likert_image_left', 
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.', 
					content: "likert image left", 
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				},
				{
					id:3, template: 'likert_image_none',
					content: "likert image none Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nibh eros, placerat a vulputate quis, faucibus quis risus.",
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				
				},
				{
					id:4, template: 'likert_image_right',
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.',
					content: "likert image right",
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				},
				{
					id: 5, template: 'multiple_choice_image_left', 
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.', 
					content: "multiplechoice image left", 
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				},
				{
					id:6, template: 'multiple_choice_image_none',
					content: "multiplechoice image none",
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				
				},
				{
					id:7, template: 'multiple_choice_image_right',
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.',
					content: "multiplechoice image right",
					options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
				},
				{
					id:8, template: 'text_image_left',
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.',
					content: "text image left"
				},
				{
					id:9, template: 'text_image_none',
					content: "text image none"
				},
				{
					id:10, template: 'text_image_right',
					image: 'https://dummyimage.com/600x400/ffffff/00bcd4.jpg&text=img.',
					content: "text image right"
				}
				
			]

		};

		$scope.index = 0;
		$scope.selected = $scope.survey.slides[0];

		$scope.result = {};

		$scope.fn = {
			next: function(timeout){
				console.log('next slide');

				$timeout(function(){
					$scope.index = Math.min($scope.index + 1, $scope.survey.slides.length - 1);
					$scope.selected = $scope.survey.slides[$scope.index];
				}, timeout)
			},
			previous: function(timeout){
				$timeout(function(){
					$scope.index = Math.max($scope.index - 1, 0);
					$scope.selected = $scope.survey.slides[$scope.index];
				}, timeout || 0);
			},
			result: function(key, value, slide){
				console.log(key, value, slide);

				if(slide){
					$scope.result[slide.id] = $scope.result[slide.id] || {};
					$scope.result[slide.id][key] = value;
				}else{
					$scope.result[key] = value;
				}
			}
		};

}]);
