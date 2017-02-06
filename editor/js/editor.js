angular.module('alpacaEditor', ['firebase', 'dndLists', 'ngTagsInput','swiperRepeat', 'ngAnimate', 'flow', 'angularResizable', 'alpacaViewer', 'alpacaSchemas', 'alpacaTypes']);

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
	'$timeout',
	'$firebaseObject',
	'$q',
	function($scope, $templateList, $schemas, $timeout, $firebaseObject, $q){

	var config = firebase.database().ref().child('config');
	$firebaseObject(config).$bindTo($scope, 'config');

	$scope.defaultTags = function(){
		var tags = ['blah', 'ahah'];
		return tags;
	};

	//$q(function(resolve, reject){
			//resolve(['hello', 'byebye'])
	//});


	$scope.templates = $templateList.templates;
	console.log($templateList);


	$scope.tabs = [
		{
			name: 'surveys',
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

	$scope.tab = $scope.tabs[3];
	
	$scope.setTab = function(tab){
		$scope.tab = tab;
	}

	$scope.survey = {

		slides: {
			1: {
				id: 1, title: 'Slide 1', content: 'Foo', template: 'green'
			},
			2: {
				id: 2, title: 'Slide 2', content: 'Bar', template: 'orange'
			},
			3: {
				id: 3, title: 'Slide 3', content: 'Fluf', template: 'orange'
			}
		},


		nodes: {
			1: {
				kind:'slide', title: 'Slide 1', content: 'Foo', template: 'green'
			},
			2: {
				kind: 'folder', title: 'Smoking'
			},
			3: {
				kind:'slide', title: 'Slide 3', content: 'Fluf', template: 'orange'
			}
		},

		nodest: [
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
	$scope.selected = $scope.survey.nodest[1];
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
			//console.log($scope.type)
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
				type: '=',
				field: '=',
				fn: '=',
				slide: '=',
				templates: '='
			}
		};
}]);

angular.module('alpacaEditor').filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});

angular.module('alpacaEditor').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
});