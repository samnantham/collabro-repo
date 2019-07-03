// lazyload config
angular.module('app')

    .constant('JQ_CONFIG', {
        
    })
    .constant('MODULE_CONFIG', [
        {
          name: 'ngMap',
          files: [
              'https://maps.googleapis.com/maps/api/js?key=AIzaSyBi_x8q2LOzxxhHsOb0_OCSCjAo3FcYEMg&sensor=false',
              'libs/map/ng-map.min.js'
          ]
        },
      {
          name: 'chart.js',
          files: [
              'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js',
              'https://cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.1.1/angular-chart.min.js',
          ]
      },
      {
        name: 'cp.ngConfirm',
          files: [
              'libs/confirm/angular-confirm.css',
              'libs/confirm/angular-confirm.js',
          ]
      }
      
      ])
    // oclazyload config
    .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: MODULE_CONFIG
        });
    }]);