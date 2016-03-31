var lnCms = angular.module('lnCms', [
  'ngConstants', require('angular-ui-router')
])
.config(['$stateProvider', '$urlRouterProvider', 
  function ($stateProvider, $urlRouterProvider) {
    lnCms.stateProvider = $stateProvider;
    lnCms.urlRouterProvider = $urlRouterProvider;

    //prevent $urlRouter from automatically intercepting URL changes
    $urlRouterProvider.deferIntercept();
  }
])
.run(['lnCmsClientService', '$urlRouter',
  function(lnCmsClientService, $urlRouter) {
    lnCms.urlRouterProvider.otherwise('/');

    lnCmsClientService.getRoutes()
      .then(function(response) {
        var routes = response.data;

        angular.forEach(routes, function(route, key) {
          var state = {
            name: route.state,
            url: route.url,
            templateUrl: 'templates/' + route.template + '/template.html',
            data: {
              endpoint: (route.endpoint || 'post'),
              fixedParams: (route.params || {})
            }
          };

          lnCms.stateProvider.state(state);
        });

        //enable $urlRouter listener again
        $urlRouter.listen();
      });
  }
]);

require('./lib/client.service');
require('./lib/controller');
require('./lib/view.directive');
