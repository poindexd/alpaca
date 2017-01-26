angular.module('alpacaEditor', ['swiperRepeat','alpacaViewer', 'alpacaSchemas', 'alpacaTypes']);


angular.module('alpacaEditor').directive('alpacaForm', [
	'$compile', 
	'$templateRequest',
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {

				$templateRequest($scope.model.template).then(function(tpl){
					var template = angular.element(tpl);
					element.after(template);
					$compile(template)($scope);
				});

		}

		return {
			restrict: 'E',
			link: link,
			scope:{
				model: '=',
				schema: '='
			}
		};
}]);

angular.module('alpacaEditor').controller('alpacaEditorController', [
	'$scope',
	'$templateList',
	'$schemas',
	function($scope, $templateList, $schemas){


	$scope.templates = $templateList.templates;
	console.log($templateList);
	
	$scope.survey = {

		slides: [
			{
				id: 1, title: 'Slide 1', content: 'Foo', template: 'green'
			},
			{
				id: 2, title: 'Slide 2', content: 'Bar', template: 'orange'
			}
		]

	};
	$scope.selected = $scope.survey.slides[1];

	$scope.schemas = $schemas.schemas;
	$scope.schema = $scope.schemas['orange'];

	/*
	$scope.schema = [
		{
			key: 'title',
			type: 'input'
		},
		{
			key: 'content',
			type: 'textarea'
		}

	];*/

  $scope.devices = {
    iphone: {
      name: 'iPhone',
      width: 480,
      height: 720,
      material_icon: 'smartphone'
    },
    desktop: {
      name: 'Desktop',
      width: 1920,
      height: 1080,
      material_icon: 'desktop_windows'
    },
    tablet: {
      name: 'Tablet',
      width: 800,
      height: 400,
      material_icon: 'tablet'
    }
  };

  $scope.setDevice = function(device) {
    $scope.selectedDevice = device;
    console.log('set device:', device);
  }

  $scope.$on('device-ready', function(){
  	$scope.setDevice($scope.devices.iphone);
  });
  
}]);

angular.module('alpacaEditor').directive('alpacaForm', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			
			$templateRequest('alpaca-type-' + $scope.slide.template).then(function(tpl){
				var template = angular.element(tpl);
				element.after(template);
				$compile(template)($scope);
			});
		}

		return {
			restrict: 'E',
			link: link
		};
}]);

angular.module('alpacaEditor').directive('alpacaField', [
	'$compile', 
	'$templateRequest', 
	function($compile, $templateRequest) {

		var link = function ($scope, element, attrs) {
			console.log($scope.type)
			$templateRequest('alpaca-type-' + $scope.type).then(function(tpl){
				var template = angular.element(tpl);
				element.after(template);
				$compile(template)($scope);
			});
		}

		return {
			restrict: 'E',
			link: link,
			scope: {
				model: '=',
				type: '='
			}
		};
}]);