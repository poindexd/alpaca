angular.module('alpacaEditor').controller('demoController', [
	'$scope',
	'$templateList',
	'$schemas',
	'$timeout',
	'$firebaseAuth',
	'$firebaseObject',
	'$firebaseArray',
	'$firebaseStorage',
	'$collectionService',
	'$window',
	function(
		$scope, 
		$templateList, 
		$schemas, 
		$timeout, 
		$firebaseAuth, 
		$firebaseObject, 
		$firebaseArray,
		$firebaseStorage,
		$collectionService,
		$window){

	var config = firebase.database().ref().child('config');
	$firebaseObject(config).$bindTo($scope, 'config');

	$scope.templates = $templateList.templates;

	//DELETE
	$scope.collectionSettingsTrue = function(){
		$scope.collectionSettings = true;
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

	$scope.schemas = $schemas.schemas;

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

	$scope.loading = false;

	$scope.search = function(){
		$scope.searching = true;
		
		///JQUERY DEP
		$timeout(function(){$('#search').focus()});
	}

	$scope.$on('device-ready', function(){
		$scope.setDevice($scope.devices[2]);
		$scope.loading = false;
	});

	$scope.fn = {
		tags: {
			search: function(query){
				//console.log('query', query);
				var ret = [];
				angular.forEach($scope.config.tags, function(el){
					if (el.text.includes(query))
						ret.push(el.text);
				})
				return ret;
			},
			onTagAdded: function(tag){
				//firebase.database().ref('tags/').child(tag);
				//fire
				console.log('tag added', tag);
			},
			onTagRemoved: function(tag){
				console.log('tag removed', tag);
			}
		},
		file: {
			fileSuccess: function($file, $flow, slide, field, model){
				
				var file = $flow.files[$flow.files.length - 1].file;
				console.log(file);

				var storageRef = firebase.storage().ref("slides").child(slide.$id).child(field.key);
    		$scope.storage = $firebaseStorage(storageRef);

    		var uploadTask = $scope.storage.$put(file);
    		uploadTask.$complete(function(snapshot) {
  				console.log(snapshot.downloadURL);
  				slide[field.key] = snapshot.downloadURL;
  				console.log('model', model);
				});
			},
			removeFile: function(slide, field, model){
				var storageRef = firebase.storage().ref("slides").child(slide.$id).child(field.key);
    		$scope.storage = $firebaseStorage(storageRef);
    		$scope.storage.$delete();
    		slide[field.key] = null;
			}
		}
	};

	$scope.currentUser = {
		name: 'Dan Poindexter',
		id: 1
	}

	$scope.organizations = [];
	$scope.organization = {
		init: function(){ 
			var ref = firebase.database().ref('organizations/').orderByChild('user_id').equalTo($scope.currentUser.id);
			$scope.organizations = $firebaseArray(ref);
		},
		add: function(){

			var organization = {
				name: $scope.newOrganization.name,
				email: $scope.newOrganization.email,
			}

			$scope.organizations.$add(organization);
		},
		remove: function(organization){
			$scope.organizations.$remove(organization);
		},
		settings: {
			tabs: [
				'Users',
				'Devices',
				'Tags',
				'Endpoints'
			],
			selectedTab: 'Users'
		}
	} //organization

	//$scope.collections = {};
	$scope.collections = $collectionService.collections;
	$scope.collection = $collectionService;
	$scope.currentCollection = $collectionService.currentCollection;
	$scope.collectionSettings = false;
	
	$scope.$watch('currentCollection', function(){
		$scope.slide.load($scope.currentCollection);
		if ($scope.collections.$save)
			$scope.collections.$save($scope.collection.index);
		if (!$scope.currentCollection){
			$scope.collectionSettings = false;
			$scope.slide.setCurrent(null, null);
		}
	}, true);

	//$scope.currentUser = {};
	/*$scope.user = {
		signin: function() {
			$firebaseAuth().$signInWithEmailAndPassword(

			)
		},
		create: function(){
			$firebaseAuth().$createUserWithEmailAndPassword(
					$scope.newUser.email,
					$scope.newUser.password
				)
				.then(function(user){
					$scope.currentUser = user;
				}).catch(function(error){
					console.log(error);
				})
		},
		delete: function(){
			$firebaseAuth().deleteUser()
				.then(function(){
					console.log('User Deleted. :/')
				}).catch(function(error){
					console.log(error);
				})
		}
	} //user
*/
	$scope.slides = [];
	$scope.searchSlides = [];
	$scope.slide = {
		add: function(kind){

			//TODO: Add Switch

			var to = $scope.slide.index ? $scope.slide.index + 1 : $scope.slide.list.length;

			var slide = {
				collectionId: $scope.currentCollection.$id,
				kind: kind,
				title: 'untitled',
				index: to
			}

			$scope.updateIndexes(
				$scope.slide.list, 
				null,
				$scope.slide.list.length,
				to, 
				function(){
					$scope.slide.list.$add(slide);
				}
			);
			
		},
		remove: function(node, list){
			console.log('Remove', node, list);

			if ($scope.selected === node){
				$scope.selected = null;	
			}

			$scope.updateIndexes(
				list, 
				node, 
				node.index, 
				list.length,
				function(){
					list.$remove(node);
				}
			);

		},
		save: function(node, list){
			//console.log('Saving node', node);
			list.$save(node);
		},
		load: function(collection){
			if (!collection)
				return;
			$scope.loading = true;
			console.log('id', collection.$id);
			var ref = firebase.database().ref('/slides').orderByChild('collectionId').equalTo(collection.$id);
			$scope.slides = $firebaseArray(ref);
			$scope.slides.$loaded()
				.then(function(x){
					console.log('slides loaded', $scope.slides);
					$scope.$watch('selected', function(){
						if ($scope.slide.list){
							$scope.slide.list.$save(
								$scope.selected
							);
						}
					}, true);
					$scope.slide.setCurrent($scope.slides[0], $scope.slides);
					$scope.loading = false;
				});
		},
		get: function(id){

		},
		search: function(){
			/*console.log('searching', $scope.searchtext);
			var ref = firebase.database().ref('/slides').orderByChild('tags/' + $scope.searchtext).equalTo(true);
			$scope.searchSlides = $firebaseArray(ref);
			$scope.searchSlides.$loaded()
				.then(function(x){
					console.log('searchSlides', $scope.searchSlides);
				});
				*/
				$scope.searchSlides = null;

				if (!$scope.searchtext || $scope.searchtext.length < 3)
					return;

			var ref = firebase.database().ref('search');
			var query = {
				index: 'firebase',
				type: 'slide',
				q: $scope.searchtext + '*'
			};

			var key = ref.child('request').push(query).key;

			console.log('search', key, query);
		
			ref.child('response').child(key).on('value', function(snapshot){
				console.log('snapshot', snapshot.val());
				if (!snapshot.val())
					return;
				var hits = snapshot.val().hits;
				if (hits && hits.hits && hits.hits.length > 0){
					$scope.$apply(function(){
						$scope.searchSlides = hits.hits.map(function(hit){
							return hit._source;
						});
					});
				}
			});
		},
		setCurrent: function(slide, list){

			$scope.slide.index = slide ? slide.index : null;
			$scope.selected = slide;
			$scope.slide.list = list;

		}
	} //slide

	$scope.$watch('searchtext', function(){
		console.log('searchtext', $scope.searchtext);
		$scope.slide.search($scope.searchtext);
	})

	// $scope.$watch('selected', function(){
	// 	$scope.slide.get($scope.selected.$id);

	// })

	$scope.frame = {
		update: function(){
			var key = $scope.currentCollection.name + '-'
								+ $scope.currentLanguage.name + '-'
								+ $scope.currentVersion.name + '-'
								+ $scope.currentFrame.name
		}
	} //frame

	$scope.init = function(){
		$scope.organization.init();
		$scope.collection.init();
		}

	
	$scope.init();

	$scope.dropCallback = function(index, item, external, type, list){
		console.log('index', index, 'item', item, 
			'external', external, 'type', type, 'list', list)
		
		var _from = item.index;
		var _to = (index > item.index) ? index - 1 : index;
		//console.log(_from + " ----> " + _to);

		$scope.updateIndexes(list, item, _from, _to);

		//Prevent client side array from changing
		return false;
	}

	//Manually update indexes
	$scope.updateIndexes = function(list, item, _from, _to, callback){
		for(var i=0; i < list.length; i++){
			var el = list[i];

			console.log(_from + " ----> " + _to);

			if(item && el.$id == item.$id)
				el.index = _to;
			else if(el.index > _from && el.index <= _to)
				el.index = el.index - 1;
			else if(el.index < _from && el.index >= _to)
				el.index = el.index + 1;
		}

		for(var i=0; i < list.length; i++){
			list.$save(i);
		}
		if (callback)
			callback();
	}

}]);