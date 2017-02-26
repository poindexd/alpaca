angular.module('alpacaEditor').controller('demoController', [
	'$scope',
	'$templateList',
	'$schemas',
	'$timeout',
	'$firebaseObject',
	'$window',
	function($scope, $templateList, $schemas, $timeout, $firebaseObject, $window){

	var config = firebase.database().ref().child('config');
	$firebaseObject(config).$bindTo($scope, 'config');

	$scope.defaultTags = function(){
		var tags = ['blah', 'ahah'];
		return tags;
	};

	$scope.templates = $templateList.templates;
	console.log($templateList);


	$scope.tabs = [
		{
			name: 'collections',
			icon: 'view_module'
		},
		{
			name: 'edit',
			icon: 'mode_edit'
		},
		{
			name: 'metadata',
			icon: 'timeline'
		},
		{
			name: 'settings',
			icon: 'settings'
		}
	];

	$scope.tab = $scope.tabs[0];
	
	$scope.setTab = function(tab){
		$scope.tab = null;
		$timeout(function(){
			$scope.tab = tab;
		}, 200)
		
	}

	$scope.survey = {

		slides: [
			{
				kind:'slide', title: 'Nested Slide 1', content: 'How certain are you that your situation will improve?', template: 'green',
				options: [
					{
						text: 'Uncertain',
						weight: 1,
						suggestions: [
							'Eat more broccoli',
							'Work out every day'
						]
					},
					{
						text: 'Somewhat uncertain',
						weight: 2
					},
					{
						text: 'Unsure',
						weight: 3
					},
					{
						text: 'Somewhat certain',
						weight: 4
					},
					{
						text: 'Certain',
						weight: 5
					}

				]
			},
			{
				kind:'slide', title: 'Nested Slide 2', content: 'How certain are you that you will achieve your goals you set?', template: 'orange',
				options: [
					{
						text: 'Uncertain',
						weight: 1
					},
					{
						text: 'Somewhat uncertain',
						weight: 2
					},
					{
						text: 'Unsure',
						weight: 3
					},
					{
						text: 'Somewhat certain',
						weight: 4
					},
					{
						text: 'Certain',
						weight: 5
					}
				]
			}
		],



		nodes: [
			{
				kind: 'external', title: 'Onboarding', contents: [
					{
						kind:'slide', title: 'Welcome', content: 'Foo', template: 'green', readonly: true
					},
					{
						kind:'slide', title: 'Instructions', content: 'Fluf', template: 'orange', readonly: true
					}
				]
			},
			{
				kind:'slide', title: 'Slide 1', content: 'Foo', template: 'green', options: [
					{text: 'Yes', correct: true},
					{text: 'No', correct: false}
				]
			},
			{
				kind:'slide', title: 'Slide 2', content: 'Fluf', template: 'orange'
			},
			{
				kind: 'folder', title: 'Smoking', contents: [
					{
						kind:'slide', title: 'Nested Slide 1', content: 'Foo', template: 'green'
					},
					{
						kind:'slide', title: 'Nested Slide 2', content: 'Fluf', template: 'orange'
					}
				]
			}
		]


	};
	$scope.selected = $scope.survey.nodes[1];
	$scope.schemas = $schemas.schemas;

	$scope.maximized = false;

	$scope.maximizePreview = function(maximized){
		/*$('.resizable-section.white').animate({
			flex: '0 0 0px'
		}, 1000, function(){
			maximized = !maximized;
		})*/
		$('.resizable-wrapper').toggleClass('minimized');
		$scope.maximized = !$scope.maximized;
	}

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
      name: 'iPad',
      width: 1024,
      height: 768,
      material_icon: 'tablet'
    }
  };

  $scope.setDevice = function(device) {
    $scope.device = device;
    console.log('set device:', device);
  }

  $scope.setSlide = function(slide){
  	$scope.selected = slide;
  	console.log(slide);
  }

  $scope.loading = false;

  $scope.search = function(){
  	$scope.searching = true;
  	
  	$timeout(function(){$('#search').focus()});
  }

  $scope.$on('device-ready', function(){
  	$scope.setDevice($scope.devices.tablet);
  	$scope.loading = false;
  	
  });

  $scope.fn = {
  	tags: {
	  	search: function(query){
	  		console.log('query', query);
	  		var ret = [];
	  		angular.forEach($scope.config.tags, function(el){
	  			if (el.text.includes(query))
	  				ret.push(el.text);
	  		})
	  		return ret;
	  	}
		}
  };

  // $scope.temps = [];

		// $scope.addTemp = function() {
		// 	$scope.temps.push({'title': $scope.newTemp, 'done':false})
		// 	$scope.newTemp = ''
		// }

		// $scope.deleteTemp = function(index) {	
		// 	$scope.temps.splice(index, 1);
		// }
  
}]);