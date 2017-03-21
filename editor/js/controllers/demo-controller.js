angular.module('alpacaEditor').controller('demoController', [
	'$scope',
	'$templateList',
	'$schemas',
	'$timeout',
	'$firebaseAuth',
	'$firebaseObject',
	'$firebaseArray',
	'$firebaseStorage',
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
		$window){

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
		//{
		//	name: 'edit',
		//	icon: 'mode_edit'
		//},
		{
			name: 'organization',
			icon: 'language'
		},
		{
			name: 'settings',
			icon: 'face'
		}
	];

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

	//$scope.selected = $scope.survey.nodes[1];
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

	//$scope.setSlide = function(slide){
	//	$scope.selected = slide;
	//	console.log(slide);
	//}

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
				//console.log('query', query);
				var ret = [];
				angular.forEach($scope.config.tags, function(el){
					if (el.text.includes(query))
						ret.push(el.text);
				})
				return ret;
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
  				model = snapshot.downloadURL;
  				console.log('model', model);
				});
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

	$scope.collections = [];
	$scope.collection = {
		init: function(){
			var ref = firebase.database().ref('collections/').orderByChild('user_id').equalTo($scope.currentUser.id);
			$scope.collections = $firebaseArray(ref);
		},
		add: function(){
			var collection = {
				title: 'Untitled Collection',
				user_id: $scope.currentUser.id,
			}

			$scope.collections.$add(collection).then(function(ref) {
			  //collectionid = ref.key;
			  //console.log("added record with id " + id);
			  //list.$indexFor(id);
			  $scope.currentCollection = $scope.collections[$scope.collections.$indexFor(ref.key)];
			});
		},
		remove: function(collection, index){
			$scope.collections.$remove(index);
			
			$scope.collection.index = null;
			$scope.currentCollection = null;
			
			var storageRef = firebase.storage().ref("collection")
				.child(collection.$id)
				.child('image');
			$scope.storage = $firebaseStorage(storageRef);
			$scope.storage.$delete().then(function(){
				//lol
			});
		},
		setCurrent: function(collection, index){
			$scope.currentCollection = collection;
			$scope.collection.index = index;
		},
		setImage: function($flow, collection){
			var file = $flow.files[$flow.files.length - 1].file;
			console.log(file);

			var storageRef = firebase.storage().ref("collection")
				.child(collection.$id)
				.child('image');
  		$scope.storage = $firebaseStorage(storageRef);

  		var uploadTask = $scope.storage.$put(file);
  		uploadTask.$complete(function(snapshot) {
				console.log(snapshot.downloadURL);
				collection.img_url = snapshot.downloadURL;
				console.log('collection', model);
			});
		},
		removeImage: function(collection){
			var storageRef = firebase.storage().ref("collection")
				.child(collection.$id)
				.child('image');
			$scope.storage = $firebaseStorage(storageRef);
			$scope.storage.$delete().then(function(){
				collection.img_url = null;
			});
		}
	} //collection

	$scope.$watch('currentCollection', function(){
		$scope.slide.load($scope.currentCollection);
		$scope.collections.$save($scope.collection.index);
		if (!$scope.currentCollection)
			$scope.collectionSettings = false;
	}, true);

	//$scope.currentUser = {};
	$scope.user = {
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

	$scope.slides = [];
	$scope.slide = {
		add: function(kind){

			//TODO: Add Switch

			var slide = {
				collectionId: $scope.currentCollection.$id,
				kind: kind,
				title: 'untitled'
			}

			$scope.slides.$add(slide);
			
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
					$scope.$watch('selected', function(new_val, old_val, scope){
						$scope.slides.$save(scope.slide.index);
					}, true);
					$scope.loading = false;
				});
		},
		setCurrent: function(slide, index){
			$scope.selected = slide;
			$scope.slide.index = index;
		}
	} //slide

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

}]);