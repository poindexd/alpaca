angular.module('alpacaViewer').directive('alpacaViewer', function() {
	return {
		restrict: 'E',
		templateUrl: 'alpaca-template-index',
		scope: {
			survey: '=',
			selected: '='
		}
	};
});