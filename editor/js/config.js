angular.module('alpacaEditor')
.config([
  '$stateProvider', 
  '$urlRouterProvider', 
  '$locationProvider', 
  function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  
 $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'about.html'
    })
    .state('login', {
      url: '/login',
      controller: 'authCtrl'
    })
    .state('collections', {
      url: '/collections',
      templateUrl: 'collections.html',
    })
    .state('collections.collection', {
      url: '/{collectionId}',
      templateUrl: 'tabs/edit/edit.html',
      resolve: {
        slide: function(){
          return {content: 'blah'}
        }
      }
    })
    // .state('editor', {
    //   url: '/editor.html',
    //   controller: 'authCtrl'
    // })
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
    .state('surveys', {
      url: '/surveys.html',
      controller: 'authCtrl'
    });
   

  $urlRouterProvider.otherwise('/');  

}]);