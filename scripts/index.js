(function(){

  var app = angular.module("OrganizEZ", ["firebase"]);
  app.config(function(){
    var config = {
      apiKey: "AIzaSyCxcUHWhkQoiVgG3cwoANfw4xfsLvdgyEk",
      authDomain: "organizez-6db68.firebaseapp.com",
      databaseURL: "https://organizez-6db68.firebaseio.com",
      storageBucket: "",
    };
    firebase.initializeApp(config);
  });

  app.controller("MoveController", ["$scope", "$firebaseArray", function($scope, $firebaseArray){
    $scope.ref = firebase.database().ref();
    $scope.moveRef = $scope.ref.child("moveActions");
    $scope.moveActions = $firebaseArray($scope.moveRef);
    $scope.commandsRef = $scope.ref.child("commands");
    $scope.openFile = function(filePath){
      $scope.commandsRef.push({
        command : ('start ' + filePath).replace(/\//g, "\\"),
        filePath : filePath.replace(/\//g, "\\"),
        rawFilePath : filePath
      });
    }
  }]);

})();
