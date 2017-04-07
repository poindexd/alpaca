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
      controller: 'authCtrl'
    })
    .state('editor', {
      url: '/editor.html',
      controller: 'authCtrl'
    })
    .state('index', {
      url: '/index.html',
      controller: 'authCtrl'
    })
    .state('signup', {
      url: '/signup.html',
      controller: 'authCtrl'
    })
    .state('settings', {
      url: '/settings.html',
      controller: 'authCtrl'
    })
    .state('organization', {
      url: '/organization.html',
      controller: 'authCtrl'
    })
    ;
   

  $urlRouterProvider.otherwise('/');  

}]);