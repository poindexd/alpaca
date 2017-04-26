angular.module('alpacaEditor')
	.controller("authCtrl", [
    "$scope", 
    "$rootScope", 
    "$firebaseAuth",
    "$state",
    "$location",
    "$window",
    "$firebaseObject",
    "$firebaseStorage",
    "$timeout",

 function($scope,
  $rootScope,
  $firebaseAuth, 
  $state, 
  $location, 
  $window,
  $firebaseObject,
  $firebaseStorage,
  $timeout) {

    $scope.signIn = function () {
      $rootScope.auth.$signInWithEmailAndPassword(
        $scope.email,  $scope.password
      ).then(function(user) {
        console.log(user);
        $rootScope.currentUser = user;
        $state.go('index');
        $window.location.reload();
      }, 
      function(error) {
        // switch(error) {
        //   case 'INVALID_EMAIL':
        //     console.log('email invalid or not signed up');
        //     alert('Invalid email!');
        //   case 'INVALID_PASSWORD':
        //     console.log('wrong password');
        //     alert('wrong password');
        //   default:
        //     console.log(error);    
        // }
        if (error.code = 'INVALID_EMAIL') {
          console.log('email invalid or not signed up — trying to sign you up!');
          alert('Invalid email or password!'); //FIXME ONLY GOES IN THIS CONDITION
          //$scope.signUp();
        } else if (error.code = 'INVALID_PASSWORD') {
          console.log('wrong password!');
          alert('Wrong password!');
        } else {
          console.log(error);
        }
      });
    };

    $scope.signUp = function(firstName, 
      lastName, 
      email, 
      password) {
      $rootScope.auth.$createUserWithEmailAndPassword(
        $scope.email, $scope.password
      ).then(function(firebaseUser) {
          firebase.database().ref('users').child(firebaseUser.uid).set({
            firstName: firstName,
            lastName: lastName,
            email: email
          }).then(function() {
            alert('Signed up successfully!')
            $state.go('index').then(function(){
              $window.location.reload(); //this doesn't work
              console.log('routing to index');
            });
          })
          console.log('user' + firebaseUser.uid + 'created successfully!');
          console.log(firstName , lastName, email);

      }).catch(function(error) {
        console.error('Error', error);
      });
    };


    $scope.resetPassword = function() {
      $rootScope.auth.$sendPasswordResetEmail(
        $scope.email
        ).then(function() {
          console.log("Password reset email sent successfully!");
          alert("Password reset email will be sent you shortly!");
      }).catch(function(error) {
          console.error("Error: ", error);
      }); 
    };


    $scope.signOut = function() {
      
      $scope.auth.$signOut().then(function() {
        $state.go('index');
        $window.location.reload();
        console.log('signed out');
      }).catch(function(error) {
          console.error("Error: ", error);
      });
    };


    $scope.signInPageRoute = function()  {
      console.log("route to a new page");
      $state.go('login');
      $window.location.reload();
    };


    // $scope.editorPageRoute = function()  {
    //   var firebaseUser = $rootScope.auth.$getAuth();
    //   if (firebaseUser) {
    //     console.log("Signed in as:", firebaseUser.uid);
    //     $state.go('editor');
    //     $window.location.reload();
    //   } else {
    //     console.log("Please sign in");
    //     $state.go('login');
    //     $window.location.reload();
    //   }
    // };

    $scope.indexPageRoute = function()  {
      var firebaseUser = $rootScope.auth.$getAuth();
      $state.go('index');
      $window.location.reload();
      
    };

    $scope.signUpRoute = function()  {
      console.log("route to a new page");
      $state.go('signup');
      $window.location.reload();
    };
    $scope.settingsPageRoute = function()  {
      console.log("route to a new page");
      $state.go('settings');
      $window.location.reload();
    };

    $scope.collectionsPageRoute = function()  {
      console.log("route to a new page");
      $state.go('collections');
      $window.location.reload();
    };
    $scope.organizationPageRoute = function() {
      console.log("route to a new page");
      $state.go('organization');
      $window.location.reload();
    };



		$scope.init = function(){
			$rootScope.auth = $firebaseAuth();
      firebase.auth().onAuthStateChanged(function(firebaseUser) {
        $rootScope.currentUser = firebaseUser;
        //editme
        //$scope.userEmail = firebaseUser.email;


        console.log('auth state changed');
        if($rootScope.currentUser) {
          $scope.isLoggedIn = true;
          var ref = firebase.database().ref('users').child($rootScope.currentUser.uid);
          $scope.user = $firebaseObject(ref);
          $scope.user.$bindTo($scope, 'user');
          //$scope.isLoggedIn = true;

        } else {
          $timeout(function(){
            $scope.isLoggedIn = false;
          }, 100);
          //$scope.isLoggedIn = false;
        }

      
      
      });

		}

		$scope.init();
    $scope.searchValue ='';
  }

]);






