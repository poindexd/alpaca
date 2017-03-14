angular.module('alpacaEditor')
	.controller("authCtrl", ["$scope", "$rootScope", "$firebaseAuth", function($scope, $rootScope, $firebaseAuth) {
		    
    $scope.signIn = function () {
      $rootScope.auth.$signInWithEmailAndPassword(
        $scope.email,  $scope.password
      ).then(function(user) {
        console.log(user);
      }, function(error) {
        if (error = 'INVALID_EMAIL') {
          console.log('email invalid or not signed up — trying to sign you up!');
          $scope.signUp();
        } else if (error = 'INVALID_PASSWORD') {
          console.log('wrong password!');
        } else {
          console.log(error);
        }
      });
    }

    $scope.signUp = function() {
      $rootScope.auth.$createUser($scope.email, $scope.password, function(error, user) {
        if (!error) {
          console.log('Successfuly created user');
          console.log(user);
        } else {
          console.log('The username and password combination you entered is invalid.');
        }
      });
    }


		$scope.init = function(){
			$rootScope.auth = $firebaseAuth();
		}
		$scope.init();
  }
]);