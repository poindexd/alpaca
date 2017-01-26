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
/*  Todo:
 *  *remove jquery dep
 *  *combine directives
 *  *on window resize
 *  *support iframe templates
 *  *clean up
 *  *publish to github
 *  *publish to npm
 */

angular.module('alpacaEditor').directive('devicePreview', function() {

  var link = function($scope, el, attrs) {

    console.log($scope.$parent);
    var parent = angular.element(el).parent();
    parent.width = $scope.$parent.frame_size.width;//$('#wrapper').width();
    parent.height = $scope.$parent.frame_size.height;//$('#wrapper').height();

    console.log('device-size', $scope.$parent.frame_size);

    var child = angular.element(el);

    $scope.$watch('device', function() {

      var device = $scope.device;

      if (!angular.element(el).parent()[0])
        return false;

      console.log($scope.device);
      
      /*$scope.$watch(
        function(){
          return {
            width: parent.width,
            height: parent.height
          }
        },
        function(){
          $scope.$apply();
        }
      )*/

      var fit = (parent.width / parent.height > device.width / device.height);
      var scale = fit ? parent.height / device.height : parent.width / device.width;
      var width = fit ? device.width * parent.height / device.height : parent.width;
      var height = fit ? parent.height : device.height * parent.width / device.width;
      
      child.css({
        'background': 'white',
      })
      
      parent.css({
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      });

      child.css({
        'zoom': scale,
        'width': width / scale + 'px',
        'height': height / scale + 'px',
      });

      var translate = {
        x: -1 * ((Math.max(device.width, width) - parent.width) / 2),
        y: -1 * ((Math.max(device.height, height) - parent.height) / 2)
      };

      $scope.$parent.iframe.css({
        'width': Math.max(device.width, width),
        'height': Math.max(device.height, height),
        'transform': 'translate(' + translate.x + 'px,' + translate.y + 'px)'
      })

      console.log('device', device.width, device.height);
      console.log('parent', parent.width, parent.height);
      console.log('scale', scale);
      console.log('new', width, height);
    });
  };

  return {
    restrict: 'E',
    link: link,
    scope: {
      'device': '='
    }
  }
});

//http://plnkr.co/edit/KRfAyc5haHyFq7FyCnxg?p=preview
angular.module('alpacaEditor').directive("wrapInFrame", [
  '$compile',
  '$timeout',
  function($compile, $timeout) {
  return {
    restrict: "E",
    scope: {},
    transclude: true,
    replace: false,
    link: function($scope, $directiveElement, $attrs, $controller, $transclude) {
      
      $scope.$parent.frame_size = {
        width: $directiveElement.parent().width(),
        height: $directiveElement.parent().height()
      }
      
      $transclude($scope.$parent, function($children, otherScope) {

        $directiveElement.html("<iframe width='100%' height='100%'>");
        var iframe = $directiveElement.find("iframe")[0];

        $scope.$parent.iframe = angular.element(iframe);

        iframe.onload = function() {

          $scope.$parent.linked = true;
          
          var iframeBody = angular.element(iframe.contentWindow.document.body);

          $("link[rel='stylesheet'], link[type='text/css'], link[href$='.css']").clone().appendTo($("iframe").contents().find("head"));
          $('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>').appendTo($("iframe").contents().find("head"));

          $compile($children)($scope.$parent, function(elem) {
            iframeBody.append(elem);
            $scope.$parent.$emit('device-ready');
          });
        };

        iframe.src = '';
      });
    }
  };
}]);