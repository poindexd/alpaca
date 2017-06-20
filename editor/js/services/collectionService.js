angular.module('alpacaEditor')
.service('$collectionService', [
	'$firebaseArray',
	'$firebaseStorage',
	function($firebaseArray, $firebaseStorage){

		this.collections = [];
		this.currentCollection = null;

		this.init = function(){
			var ref = firebase.database().ref('collections/')
				.orderByChild('user_id')
				.equalTo(1);
			this.collections = $firebaseArray(ref);
		};

		this.add = function(){
			var collection = {
				title: 'Untitled Collection',
				user_id: 1,
			}

			this.collections.$add(collection).then(function(ref) {
			  //collectionid = ref.key;
			  //console.log("added record with id " + id);
			  //list.$indexFor(id);
			  this.currentCollection = this.collections[this.collections.$indexFor(ref.key)];
			});
		};

		this.remove = function(collection, index){
			this.collections.$remove(collection);
			
			this.index = null;
			this.currentCollection = null;
			
			this.removeImage(collection);
		}

		this.setCurrent = function(collection, index){
			this.currentCollection = collection;
			this.index = index;
		}

		this.setImage = function($flow, collection){
			var file = $flow.files[$flow.files.length - 1].file;

			var storageRef = firebase.storage()
				.ref("collection")
				.child(collection.$id)
				.child('image');

  		var uploadTask = $firebaseStorage(storageRef).$put(file);
  		uploadTask.$complete(function(snapshot) {
				collection.img_url = snapshot.downloadURL;
			});
		}

		this.removeImage = function(collection){
			var ref = firebase.storage()
				.ref("collection")
				.child(collection.$id)
				.child('image');

			$firebaseStorage(ref).$delete().then(function(){
				collection.img_url = null;
			});
		}

}]);