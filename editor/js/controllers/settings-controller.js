// angular.module('alpacaEditor')
//     .factory('person', function (fbURL, $firebase) {
//         return $firebase(new Firebase(fbURL)).$asArray();
//       })
// angular.module('alpacaEditor')    
//      .value('fbURL', 'https://hotpath-f9c54.firebaseio.com/')

angular.module('alpacaEditor')
    .controller("settingsController", [
        '$scope', 
        '$firebaseAuth',
        '$firebaseObject',
        '$firebaseStorage',
        '$window',
        '$rootScope',

        function($scope, 
            $firebaseAuth, 
            $firebaseObject, 
            $firebaseStorage, 
            $window, 
            $rootScope) {

            //Watch for rootScope.currentUser
            $rootScope.$watch('currentUser', function() {
                if($rootScope.currentUser) {
                    var ref = firebase.database().ref('users').child($rootScope.currentUser.uid);
                    $scope.user = $firebaseObject(ref);
                    $scope.user.$bindTo($scope, 'user');
                }
               
            });
            $scope.setImage = function($flow){
                var file = $flow.files[$flow.files.length - 1].file;
                console.log(file);

                var storageRef = firebase.storage().ref("users")
                    .child($rootScope.currentUser.uid)
                    .child('profilePic');
            $scope.storage = $firebaseStorage(storageRef);

            var uploadTask = $scope.storage.$put(file);
            uploadTask.$complete(function(snapshot) {
                    console.log(snapshot.downloadURL);
                    $scope.user.profilePic = snapshot.downloadURL;
                    //console.log('users', model);
                });
            }

            $scope.removeImage = function(){
            var storageRef = firebase.storage().ref("users")
                .child($rootScope.currentUser.uid)
                .child('profilePic');
            $scope.storage = $firebaseStorage(storageRef);
            $scope.storage.$delete().then(function(){
                $scope.user.profilePic = null;
            });
            } 

            $scope.changeEmail = function(email) {
                $scope.auth.$updateEmail(email).then(function() {
                    console.log('email changed successfully');
                }).catch(function(error) {
                    console.log('error', error);
                })
            }

         // $scope.auth.$changeEmail({
         //      oldEmail: $rootScope.currentUser.email,
         //      newEmail: $scope.email
         //    }).then(function() {
         //      console.log('Email changed successfully');
         //    }).catch(function(error) {
         //      console.log('Error', error);
         //    });

         // $scope.UpdateEmailAsync(email){
         //    $scope.email = email;
         // }
            

        // $scope.firstName = "Haemin";
        // $scope.lastName = "Park";
        // $scope.email = 'haemin@wellopp.com';
        // $scope.profilePic = 'http://danpoindexter.com/img/danpoindexter.png';
        // $scope.orgPic = './img/logo_butterfly_only.svg';

        $scope.editorEnabled = false;

}]);  