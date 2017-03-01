angular.module('alpacaViewer').directive('alpacaViewer', function() {
	return {
		restrict: 'E',
		templateUrl: 'alpaca-template-index',
		scope: {
			slides: '=',
			selected: '='
		}
	};
});