angular.module('alpacaViewer').controller('alpacaViewerController', ['$scope', function($scope){
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

	}

	$scope.selected = $scope.survey.slides[2];

}]);