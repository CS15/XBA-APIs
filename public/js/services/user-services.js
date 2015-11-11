(function(){
    'user strict';
    
    angular.module('services').factory('UserServices', ['$http', function($http){
        
        function login(user) 
            return $http.post('/api/profile/login', user);
        }
        
        return {
            login: login
        }
    }]);
})();