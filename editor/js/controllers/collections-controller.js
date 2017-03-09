angular.module('alpacaEditor')
	.controller('collectionsController', ['$scope', function($scope) {

		$scope.searchValue ='';

		$scope.surveys = [
			{
				title: 'Inflammatory Bowel Disease Survey', author: 'Haemin Park', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2016/05/ibd-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Pregnancy and Childbirth Survey', author: 'No one', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/pcb-420x315.jpg', date: "02-20-2017"
			},
			{
				title: 'Overactive Bladder Survey', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/oab-1-420x315.jpg', date: "01-23-2017"
			},
			{
				title: 'Survey 4', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/crc-420x315.jpg', date: "01-01-2017"
			},
			{
				title: 'Survey 5', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/bc-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Survey 6', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/hf-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Survey 7', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/condi_dementia-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Survey 8', author: 'Poo', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/bp_level_of_pain_01_455x620-420x315.jpg', date: "01-20-2017"
			}
		];

	}]);
