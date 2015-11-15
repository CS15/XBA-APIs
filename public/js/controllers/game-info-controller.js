(function () {
    'use strict';

    angular.module('controllers').controller('GameInfoController', ['$route', '$location', '$routeParams', 'XaServices', 'ParseServices',
        function ($route, $location, $routeParams, XaServices, ParseServices) {

            if (!Parse.User.current()) $location.path('/');

            var gamePermalink = $routeParams.permalink;

            var vm = this;

            XaServices.getGameInfo(gamePermalink).then(function(response){
                vm.gameInfo = response;

                ParseServices.getGameInfo(vm.gameInfo.gameId).then(function(response){
                    if (response.length > 0) {
                        vm.inParse = true;
                        vm.parseObjectId = response[0].objectId;
                    }

                    vm.gameInfoChecked = true;
                });

                XaServices.getGameAchievements(gamePermalink).then(function(response){
                    vm.achievements = response;

                    ParseServices.getGameAchievements(vm.gameInfo.gameId).then(function(response){
                        vm.parseAchievements = response;

                        if (response.length > 0) {
                            angular.forEach(vm.achievements, function(value, key){

                               for(var i in vm.parseAchievements) {
                                   if (value.achievementId === response[i].achievementId) {
                                       value.inParse = true;
                                   }
                               }
                            });
                        }

                        vm.gameAchievementsChecked = true;
                    });
                });
            });



            vm.addGameInfoToParse = function(game) {
                ParseServices.updateGameInfo(game).then(function (response) {
                    $route.reload();
                });
            };

            vm.uploadAllAchievements = function (){
                if (vm.achievements.length > 0) {

                    angular.forEach(vm.achievements, function(value, key){
                        value.game = vm.parseObjectId;
                        value.gameId = vm.gameInfo.gameId;
                    });

                    ParseServices.uploadAchievements(vm.achievements).then(function (response){
                        alert('Achievements Uploaded');
                    }, function(error){
                        console.log(error);
                        alert('Error');
                    });
                }
            };

    }]);
})();