// angular.module('alpacaEditor').run(["$rootScope", "$state", function($rootScope, $state) {
//   $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
//     // We can catch the error thrown when the $requireSignIn promise is rejected
//     // and redirect the user back to the home page
//     if (error === "AUTH_REQUIRED") {
//       $state.go("home");
//     }
//   });
// }]);

angular.module('alpacaEditor')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  // $urlRouterProvider.rule(function ($injector, $location) {
  //   var path = $location.path();
  //   console.log(path);
  //   // if (path == '/login.html*') {
  //   //   console.log(path);
  //   //   path = '/';
  //   // }
  // });
  
 $stateProvider
    .state('login', {
      url:'/login.html',
      //templateUrl: 'login.html',
      controller: 'authCtrl'
      // resolve: {
      //   // controller will not be loaded until $requireSignIn resolves
      //   // Auth refers to our $firebaseAuth wrapper in the factory below
      //   "currentAuth": ["firebaseAuth", function(auth) {
      //     // $requireSignIn returns a promise so the resolve waits for it to complete
      //     // If the promise is rejected, it will throw a $stateChangeError (see above)
      //     return firebaseAuth.$requireSignIn();
      //   }]
      // }
    })
    .state('editor', {
      url: '/editor.html',
      //templateUrl:'editor.html',
      controller: 'authCtrl'
      // resolve: {
      //   // controller will not be loaded until $waitForSignIn resolves
      //   // Auth refers to our $firebaseAuth wrapper in the factory below
      //   "currentAuth": ["Auth", function(Auth) {
      //     // $waitForSignIn returns a promise so the resolve waits for it to complete
      //     return Auth.$waitForSignIn();
      //   }]
      // }

    })
    .state('home', {
      url: '/index.html',
      controller: 'authCtrl'
      //  resolve: {
      //   // controller will not be loaded until $waitForSignIn resolves
      //   // Auth refers to our $firebaseAuth wrapper in the factory below
      //   "currentAuth": ["firebaseAuth", function(auth) {
      //     // $waitForSignIn returns a promise so the resolve waits for it to complete
      //     return firebaseAuth.$waitForSignIn();
      //   }]
      // }
    });
   

  $urlRouterProvider.otherwise('/');  

}]);