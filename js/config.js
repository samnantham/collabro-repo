var app = angular.module('app')
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function($controllerProvider, $compileProvider, $filterProvider, $provide) {

                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
                app.apiurl = "http://mswebsg.info/server/api/";
                app.imageurl = "http://mswebsg.info/server/";
                app.productshareurl = "http://mswebsg.info/server/shareproduct/";
                app.feedshareurl = "http://mswebsg.info/server/sharefeed/";
                app.friendshareurl = "http://mswebsg.info/server/sharefriend/";
                app.projectshareurl = "http://mswebsg.info/server/shareproject/";
                app.todoshareurl = "http://mswebsg.info/server/sharetodo/";
                app.servicetypes = ['Service','Shop','Rental','Event'];
                app.requestservicetypes = ['Service'];
                app.requestcategories = ['Wedding planner', 'Photographer', 'Wedding car', 'Plumber', 'Phone repair'];
                app.todotypes = ['Project','Personal'];
                app.projecttypes = ['Accounting','Beauty Therapy','Advertising and Marketing','Transportation','Courier Services','Auto Services','Renovation','Medical','Food & Beverage','Wedding Services','Pest Control','Automobile','Landscaping','Accounting','Pet-Care Services','Photography / Videography','Childcare Services','Maintenance Services','Cleaning Services','Printing Services','Security Services','Consulting Services','Property & Inspection','Copywriting & Proof ','Property Management Services','Printing & Publishing ','Art & Decorating ','Entertainment','Talent Management','Presenter','Event Management','Health Care ','Education & Training','Shipping and Delivery','HR and Employment Services','Travel','Health & Fitness','Fashion','Web and Programming','Wedding ','Plant & Landscaping','Limousine Services','Miscellaneous Services'];
                app.imgextensions = ['jpeg', 'png', 'jpg', 'gif'];
                app.periodtypes = ['Hour','Day', 'Week', 'Month'];
                app.locations = ['Singapore'];
                app.currencies = ['USD','SGD'];
                app.geopos = [1.290270,103.851959];
                app.maxUploadsize = 5000000;
                app.professions = ['Carpenter','Electrician','Plumber'];
                app.rentaltypes = ['Hourly','Daily','Weekly','Mothly','Yearly'];
                app.eventtypes = ['Music Events','Game Events'];
                app.times = ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];
                app.Servicefeatures = [{"feature":"Prosthetic Make-Up"},{"feature":"Bridal Make-Up"},{"feature":"Event Make-Up"},{"feature":"Studio Make-Up"}];
                app.Shopfeatures = [{"feature":"Prosthetic Make-Up"},{"feature":"Bridal Make-Up"},{"feature":"Event Make-Up"},{"feature":"Studio Make-Up"}];
                app.Rentalfeatures = [{"feature":"Registrant must be at least 18 years old"},{"feature":"Free AromaEase 5ml essential oil"},{"feature":"Goodie bag for the first 5000 participants"},{"feature":"Beetroot Lavender Lip Balm"}];
                app.Eventfeatures = [{"feature":"Registrant must be at least 18 years old"},{"feature":"Free AromaEase 5ml essential oil"},{"feature":"Goodie bag for the first 5000 participants"},{"feature":"Beetroot Lavender Lip Balm"}];
                app.redirectroutes = ['viewfeed','viewuser','viewproduct','viewtodo','viewitem'];
            }
        ])
    .run(['bowser', '$rootScope', function(bowser, $rootScope) {
        $rootScope.browser = bowser.name;
        $rootScope.version = bowser.version;
    }])
    .config([
        'FacebookProvider',
        function(FacebookProvider) {
            FacebookProvider.init({ appId: "307916346432414", version: "v2.4"});
        }
    ])
    .config(['GoogleSigninProvider', function(GoogleSigninProvider) {
        GoogleSigninProvider.init({
            client_id: '775600259665-42povclg850isclj1vciqglct7aho4vl.apps.googleusercontent.com',
        });
    }])

    .config( ['$compileProvider',
        function( $compileProvider )
        {   
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|tel|mailto|chrome-extension|whatsapp):/);
        }
    ])
 var firebaseconfig = {
    apiKey: "AIzaSyC1iW54FTcjLnu-lEzfGKn8HIffLfGjCUM",
    authDomain: "democollabro.firebaseapp.com",
    databaseURL: "https://democollabro.firebaseio.com",
    projectId: "democollabro",
    storageBucket: "",
    messagingSenderId: "878690100885"
  };
  firebase.initializeApp(firebaseconfig);