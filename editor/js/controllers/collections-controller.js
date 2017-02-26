angular.module('alpacaEditor')
	.controller('collectionsController', ['$scope', function($scope) {

		$scope.searchValue ='';

		$scope.surveys = [
			{
				title: 'Survey1', author: 'Haemin Park'
			},
			{
				title: 'Survey2', author: 'No one'
			},
			{
				title: 'Survey3', author: 'Poo'
			},
			{
				title: 'Survey4', author: 'Poo'
			},
			{
				title: 'Survey5', author: 'Poo'
			},
			{
				title: 'Survey6', author: 'Poo'
			},
			{
				title: 'Survey7', author: 'Poo'
			}
			
		];

		// $scope.addSurvey = function() {
  //   		$scope.surveys.title.push($scope.enteredTitle);    
  //   		$scope.enteredTitle = '';
  //   		$scope.surveys.author.push($scope.enteredAuthor);
  //   		$scope.enteredAuthor = '';

  // 		};
  
 	// 	$scope.removeSurvey = function(title, author) {
  //  			 $scope.surveys.title = $scope.surveys.filter(x => x != title);
  //  			 $scope.surveys.author = $scope.surveys.filter(x => x != author);

  // 		}
	}]);