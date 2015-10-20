(function () {
    'use strict';

    angular.module('controllers').controller('NewsController', ['ApiServices',
        function (ApiServices) {
            var vm = this;
            
            ApiServices.getLatestNews(1).then(function (response) {
                vm.news = response.data;
                vm.selectedNews = vm.news[0];
                makeNetworkCall();
            });

            vm.update = function () {
                makeNetworkCall();
            };

            function makeNetworkCall() {
                ApiServices.getNewsDetails(vm.selectedNews.permalink).then(function (response) {
                    vm.newsDetails = response.data;
                });
            }
        }]);

    angular.module('controllers').controller('LatestNewsController', ['ApiServices',
        function (ApiServices) {
            var vm = this;
            
            vm.pageNumber = 1;

            ApiServices.getLatestNews().then(function (response) {
                vm.news = response.data;
            });

            vm.getNews = function () {
                ApiServices.getLatestNews(vm.pageNumber).then(function (response) {
                    vm.news = response.data;
                });
            }
        }]);
})();