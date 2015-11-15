(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$location', '$routeParams', 'XaServices',
        function ($location, $routeParams, XaServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;

            XaServices.getGameInfo(gamePermalink).then(function(response){
                vm.gameInfo = response.data;
                console.log(vm.gameInfo);

                XaServices.getGameAchievements(gamePermalink).then(function(response){
                    vm.achievements = response.data;
                    console.log(response.data);
                });
            });
    }]);
})();