angular.module('alpacaViewer').directive('alpacaSlides', [
	'$compile',
	function($compile) {

		var link = function($scope, element, attrs){
			var template = {};

			if (Array.isArray($scope.slides)){
				template = angular.element("<div swiper-repeat='slide in slides' swiper-repeat-selected='selected'><alpaca-slide slide='slide' fn='fn'/></div>");
				element.append(template);
				//alert('hi');
			} else {
				template = angular.element("<div style='width:100%'><alpaca-slide slide='selected' single='true'/></div>");
				element.html(template);
				//alert('bye');
			}

			$compile(template)($scope);
		}

		return {
			restrict: 'E',
			replace: true,
			//template: "<div swiper-repeat='slide in slides' swiper-repeat-selected='selected'><alpaca-slide slide='slide'/></div>"
			//template: "<div style='width:100%'><alpaca-slide slide='selected'/></div>"
			link: link
		};
}]);