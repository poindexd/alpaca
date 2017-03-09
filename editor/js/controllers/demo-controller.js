angular.module('alpacaEditor').controller('demoController', [
	'$scope',
	'$templateList',
	'$schemas',
	'$timeout',
	'$firebaseObject',
	'$firebaseArray',
	'$window',
	function($scope, $templateList, $schemas, $timeout, $firebaseObject, $firebaseArray, $window){

	var config = firebase.database().ref().child('config');
	$firebaseObject(config).$bindTo($scope, 'config');

	$scope.defaultTags = function(){
		var tags = ['blah', 'ahah'];
		return tags;
	};

	$scope.templates = $templateList.templates;
	console.log($templateList);

	$scope.newDevice = {};
	$scope.addDevice = function(){
			$scope.devices.push(angular.copy($scope.newDevice));
			$scope.newDevice = null;	
	}

	$scope.tabs = [
		{
			name: 'collections',
			icon: 'view_module'
		},
		{
			name: 'edit',
			icon: 'mode_edit'
		},
		{
			name: 'organization',
			icon: 'language'
		},
		{
			name: 'settings',
			icon: 'face'
		}
	];

	$scope.organizationSettings = {
		tabs: [
			'Users',
			'Devices',
			'Tags',
			'Endpoints'
		],
		selectedTab: 'Users'
	}

	$scope.users = [
		{
			name: 'Dan Poindexter',
			email: 'dan@wellopp.com',
			img: 'http://danpoindexter.com/img/danpoindexter.png'
		},
		{
			name: 'Haemin Park',
			email: 'haemin@wellopp.com',
			img: '/img/haemin.png'
			//img: 'http://cdn3.volusion.com/hpwvr.gdwwx/v/vspfiles/photos/PE-ZA1733-1.jpg?1458140223'
		},
		{
			name: 'Poo',
			email: 'poo@poo.com',
			img: 'http://rs619.pbsrc.com/albums/tt276/cardunne09/so_poo.jpg~c200'
		}


	];


	$scope.tab = $scope.tabs[0];
	
	$scope.setTab = function(tab){
		$scope.tab = null;
		$timeout(function(){
			$scope.tab = tab;
		}, 200)
		
	}

	$scope.codemirrorOpts = {
		//mode: {name: 'jsonata', jsonata: jsonata, template: true},
		autoCloseBrackets: {
				pairs: "()[]{}",
				triples: "",
				explode: "[]{}()"
		},
		matchBrackets: true,
		viewportMargin: Infinity,
		lineNumbers: true
	}

	$scope.survey = {

		slides: [
			{
				kind:'slide', title: 'Nested Slide 1', content: 'How certain are you that your situation will improve?', template: 'green',
				options: [
					{
						text: 'Uncertain',
						weight: 1,
						suggestions: [
							'Eat more broccoli',
							'Work out every day'
						]
					},
					{
						text: 'Somewhat uncertain',
						weight: 2
					},
					{
						text: 'Unsure',
						weight: 3
					},
					{
						text: 'Somewhat certain',
						weight: 4
					},
					{
						text: 'Certain',
						weight: 5
					}

				]
			},
			{
				kind:'slide', title: 'Nested Slide 2', content: 'How certain are you that you will achieve your goals you set?', template: 'orange',
				options: [
					{
						text: 'Uncertain',
						weight: 1
					},
					{
						text: 'Somewhat uncertain',
						weight: 2
					},
					{
						text: 'Unsure',
						weight: 3
					},
					{
						text: 'Somewhat certain',
						weight: 4
					},
					{
						text: 'Certain',
						weight: 5
					}
				]
			}
		],



		nodes: [
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
	$scope.selected = $scope.survey.nodes[1];
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

	$scope.devices = [
		{
			name: 'iPhone',
			width: 480,
			height: 720,
			material_icon: 'smartphone'
		},
		{
			name: 'Desktop',
			width: 1920,
			height: 1080,
			material_icon: 'desktop_windows'
		},
		{
			name: 'iPad',
			width: 1024,
			height: 768,
			material_icon: 'tablet'
		}
	];

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
		
		///JQUERY DEP
		$timeout(function(){$('#search').focus()});
	}

	$scope.$on('device-ready', function(){
		$scope.setDevice($scope.devices[0]);
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

	$scope.init = function(){

		$scope.organizations = $firebaseArray(
			firebase.database().ref().child('organizations/').orderByChild('users').equalTo('dan@wellopp.com')
		);
	}
	
	$scope.init();

}]);