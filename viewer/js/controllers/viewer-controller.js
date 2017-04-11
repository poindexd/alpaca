angular.module('alpacaViewer').controller('alpacaViewerController', ['$scope', function($scope){
	$scope.survey = {

		slides: [
			// {
			// 	//id: 1, template: 'index'
			// }
			// ,
			{
				id: 2, template: 'likert_image_left', 
				image: '/img/image-placeholder_grey.svg', 
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ", 
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			},
			{
				id:3, template: 'likert_image_none',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			
			},
			{
				id:4, template: 'likert_image_right',
				image: '/img/image-placeholder_grey.svg',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			},
			{
				id: 5, template: 'multiple_choice_image_left', 
				image: '/img/image-placeholder_grey.svg', 
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ", 
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			},
			{
				id:6, template: 'multiple_choice_image_none',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			
			},
			{
				id:7, template: 'multiple_choice_image_right',
				image: '/img/image-placeholder_grey.svg',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
				options: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}]
			},
			{
				id:8, template: 'text_image_left',
				image: '/img/image-placeholder_grey.svg',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. "
			},
			{
				id:9, template: 'text_image_none',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. "
			},
			{
				id:10, template: 'text_image_right',
				image: '/img/image-placeholder_grey.svg',
				content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. "
			}
			
		]

	}

	$scope.selected = $scope.survey.slides[0];

}]);
