angular.module('alpacaEditor')
	.controller('collectionsController', ['$scope', function($scope) {

		$scope.searchValue ='';

		$scope.surveys = [
			{
				title: 'Inflammatory Bowel Disease', organization: 'Haemin Park', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2016/05/ibd-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Pregnancy and Childbirth', organization: 'No one', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/pcb-420x315.jpg', date: "02-20-2017"
			},
			{
				title: 'Overactive Bladder', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/oab-1-420x315.jpg', date: "01-23-2017"
			},
			{
				title: 'Colorectal Cancer', organization: 'Wellopp', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/crc-420x315.jpg', date: "01-01-2017"
			},
			{
				title: 'Breast Cancer', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/bc-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Heart Failure', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/hf-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Older Person', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/condi_dementia-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Low Back Pain', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/bp_level_of_pain_01_455x620-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Stroke', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/05/resized-for-WordPress-840x630.jpg', date: "01-20-2017"
			},
			{
				title: 'Lung Cancer', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/02/lc_01_455x620-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Depression and Anxiety', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/da_01_455x620-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Cleft Lip and Palate', organization: 'Wellopp', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2013/10/clp-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Parkinsons Desease', organization: '💩', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/parkinsons_disease-420x315.jpg', date: "01-20-2017"
			},
			{
				title: 'Craniofacial Microsomia', organization: 'Wellopp', summary: "This survey is dumb", img_url: 'http://www.ichom.org/wp-content/uploads/2015/03/cfm-420x315.jpg', date: "01-20-2017"
			}
		];

		// $scope.add3Dots = function(string, limit) {

		// 	var dots = "...";
		// 		if(string.length > limit) {
		
		// 		string = string.substring(0,limit) + dots;
		// 		}

		// 		return string;
		// 	}	

		// };
	}]);
