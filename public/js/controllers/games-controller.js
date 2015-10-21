(function () {
    'use strict';

    angular.module('controllers').controller('GamesController', ['ApiServices',
        function (ApiServices) {
            var vm = this;
            
            vm.tabs = [
                { id: 1, title:'Game Information', templateUrl:'/views/game-info-partial.html' },
                { id: 2, title:'Achievements', templateUrl:'/views/achievements-partial.html' },
                { id: 3, title:'Screenshots', templateUrl: '/views/screenshots-partial.html' },
                { id: 4, title:'Achievement Comments', templateUrl: '/views/ach-comments-partial.html' }
            ];
            
            vm.currentId = vm.tabs[0].id;
            vm.screenshotsPageNumber = 1;
            vm.selectedGame = undefined;
            vm.selectedAchievement = undefined;

            ApiServices.getLatestAchievements().then(function (response) {
                vm.games = response.data;
            });
            
            vm.update = function(id){
                vm.currentId = id;
                vm.achievements = undefined;
                vm.screenshots = undefined;
                vm.gameInfo = undefined;
                vm.comments = undefined;
                
                switch (id) {
                    case 1:
                        getGameInfo();
                        break;
                    case 2:
                        getAchievements();
                        break;
                    case 3:
                        getScreenshots();
                        break;
                    case 4:
                        getAchievements();
                        vm.getAchievementComments();
                        break;
                }
            };

            function getAchievements() {
                ApiServices.getAchievements(vm.selectedGame.permalink).then(function (response) {
                    vm.achievements = response.data;
                });
            };

            function getScreenshots() {
                ApiServices.getScreenshots(vm.selectedGame.permalink, vm.screenshotsPageNumber).then(function (response) {
                    vm.screenshots = response.data;
                });
            };
            
            function getGameInfo() {
                ApiServices.getGameInfo(vm.selectedGame.permalink).then(function (response) {
                    vm.gameInfo = response.data;
                });
            };

            vm.getAchievementComments = function(){
                vm.comments = undefined;
                
                ApiServices.getAchievementComments(vm.selectedGame.permalink, vm.selectedAchievement.permalink).then(function(response){
                    vm.achievementComments = response.data;
                });
            }
        }]);

    angular.module('controllers').controller('LatestAchievementsController', ['ApiServices',
        function (ApiServices) {
            var vm = this;
            
            vm.pageNumber = 1;

            ApiServices.getLatestAchievements().then(function (response) {
                vm.achievements = response.data;
            });

            vm.getLatestAchievements = function () {
                ApiServices.getLatestAchievements(vm.pageNumber).then(function (response) {
                    vm.achievements = response.data;
                });
            }
        }]);
})();