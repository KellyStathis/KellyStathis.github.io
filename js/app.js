var app = angular.module("indexApp", []);

app.filter('safeHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});
app.controller('IndexController', ['$scope', function($scope) {
  $scope.show = "home";
  $scope.navToggle = function(name){
    $scope.show = name;
  }

}]);
