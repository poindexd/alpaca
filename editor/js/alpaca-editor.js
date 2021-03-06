angular.module('alpacaEditor', [
	'firebase',					//Authentication, DB, Storage
	'rzModule', 				//**Range Slider 
	'dndLists',					//Drag and drop lists
	'ngTagsInput',			//**Multiple Tag Input
	'swiperRepeat', 		//Swipeable repeat
	'ngAnimate',				//Animations
	'flow',							//File upload
	'angularResizable',	//Make elements user-resizable
  'ui.codemirror',    //Code editor, for writing jsonata
	'angularUtils.directives.dirPagination', //pagination 
  'validation.match',	//remove??
	'alpacaViewer', 
	'alpacaSchemas', 
	'alpacaTypes',
  'ui.router',
  'angular-content-editable',
  'UserValidation'
]);

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

angular.module('alpacaEditor').directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
    var speed = attrs.scrollSpeed;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, speed || "slow");
      });
    }
  }
});
