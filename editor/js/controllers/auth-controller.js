
// angular.module('alpacaEditor')
// .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
//   //$locationProvider.html5Mode(true);
//   // $urlRouterProvider.rule(function ($injector, $location) {
  
//   //   console.log($location.path());
//   //   if ($location.path() == 'login.html#') {
//   //      $location.path('editor.html').replace();
//   //      console.log(path);
//   //   }
//   // });

//   //$urlRouterProvider.otherwise('/');
//   $stateProvider
//     .state('home', {
//       url:'^/editor',
//       templateUrl: 'editor.html',
//       controller: 'authCtrl'
//     }); 


// }]);

angular.module('alpacaEditor')
	.controller("authCtrl", [
    "$scope", 
    "$rootScope", 
    "$firebaseAuth",
    "$state",
    "$location",
    "$window",

 function($scope, $rootScope, $firebaseAuth, $state, $location, $window) {
		    
    $scope.signIn = function () {
      $rootScope.auth.$signInWithEmailAndPassword(
        $scope.email,  $scope.password
      ).then(function(user) {
        console.log(user);
      $state.go('editor');
      $window.location.reload();
      //$state.forceReload();
      //   $state.transitionTo('home', {}, {
      //     reload: true,
      //     inherit: false,
      //     notify: true
      // });

      }, function(error) {
        if (error = 'INVALID_EMAIL') {
          console.log('email invalid or not signed up — trying to sign you up!');
          //$scope.signUp();
        } else if (error = 'INVALID_PASSWORD') {
          console.log('wrong password!');
        } else {
          console.log(error);
        }
      });
    };

    $scope.signUp = function() {
      $rootScope.auth.$createUserWithEmailAndPassword(
        $scope.email, $scope.password
      ).then(function(firebaseUser) {
          console.log('user' + firebaseUser.uid + 'created successfully!');
          $state.go('home');
          $window.location.reload();

      }).catch(function(error) {
        console.error('Error', error);
      
      });
    };


    $scope.resetPassword = function() {
      $rootScope.auth.$sendPasswordResetEmail(
        $scope.email
        ).then(function() {
          console.log("Password reset email sent successfully!");
      }).catch(function(error) {
          console.error("Error: ", error);
      }); 
    };

    $scope.signOut = function() {
      $scope.auth.$signOut();
      $state.go('home');
      $window.location.reload();
      
    };



    $scope.signInPageRoute = function()  {
      console.log("route to a new page");
      $state.go('login');
      $window.location.reload();
    };

    $scope.editorPageRoute = function()  {
      var firebaseUser = $rootScope.auth.$getAuth();
      if (firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        $state.go('editor');
        $window.location.reload();

      } else {
        console.log("Please sign in");
        $state.go('login');
        $window.location.reload();
      }

    };

    $scope.indexPageRoute = function()  {
      console.log("route to a new page");
      $state.go('home');
      $window.location.reload();
    };



		$scope.init = function(){
			$rootScope.auth = $firebaseAuth();
//       firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//         // User is signed in.
//           $state.go('editor');

//         } else {
//           // No user is signed in.
//           $state.go('login');
//         }
// });

		}

		$scope.init();
  }

]);






