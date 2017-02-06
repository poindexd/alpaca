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

    var parent = angular.element(el).parent();
    var child = angular.element(el);

    child.css({
      'background': 'white',
    })
      
    parent.css({
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    });

/*function(){

      return {
        frame_size: $scope.$parent.frame_size
        device: $scope.device
      }

    },*/

    $scope.$watch('device',
     function() {

      var device = $scope.device;

      if (!angular.element(el).parent()[0])
        return false;

      parent.width = $scope.$parent.frame_size.width;
      parent.height = $scope.$parent.frame_size.height;

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
        'transform': 'scale(' + scale +')',
        //'zoom': scale,
        'width': width / scale + 'px',
        'height': height / scale + 'px',
      });


      var use = {
        x: Math.max(device.width, width),
        y: Math.max(device.height, height)
      }
      var translate = {
        x: -1 * ((use.x - parent.width) / 2),
        y: -1 * ((use.y - parent.height) / 2)
      };

      $scope.$parent.iframe.css({
        'width': use.x,
        'height': use.y,
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
      

      /*$scope.$watch(
          function () { 
              return {
                 width: $directiveElement.parent().width(),
                 height: $directiveElement.parent().height(),
              }
         },
         function (data) {
          $scope.$parent.frame_size = data;
          //alert('size changed!');
         }, //listener 
         true //deep watch
      );*/
      
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