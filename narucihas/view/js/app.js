var app = angular.module('starterApp', ['ngMaterial','ngRoute','ngMessages']);

app.factory('socket',function(){
    var socket = io.connect('http://localhost:3000');
    return socket;
});

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'home.html'
        })
        .when('/create',{
            templateUrl: 'create.html'
        })
        .when('/view',{
            templateUrl: 'view.html'
        })
        .when('/delete',{ //Open delete.html
            templateUrl: 'delete.html'
        })
    ;
});

app.controller('HasController',function($scope,$mdDialog,$http,socket) {

    $scope.foodData = [];
    $scope.formData = {};
    $scope.voteData = {};
    $scope.hiddenrows = [];
    getHasData();
    function getHasData() {
        $http.get("/has").success(function(response){
            $scope.foodData = response.data;
        });
    }
    $scope.submitHas = function(ev) {
        var data = {
            "question" : $scope.formData.hasQuestion,
            "hrana" : [{
                "option" : $scope.formData.hasFood1, "vote" : 0
            },{
                "option" : $scope.formData.hasFood2, "vote" : 0
            },{
                "option" : $scope.formData.hasFood3, "vote" : 0
            },{
                "option" : $scope.formData.hasFood4, "vote" : 0
            },{
                "option" : $scope.formData.hasFood5, "vote" : 0
            },{
                "option" : $scope.formData.hasFood6, "vote" : 0
            },{
                "option" : $scope.formData.hasFood7, "vote" : 0
            },{
                "option" : $scope.formData.hasFood8, "vote" : 0
            },{
                "option" : $scope.formData.hasFood9, "vote" : 0
            },{
                "option" : $scope.formData.hasFood10, "vote" : 0
            }]
        };
        var message = {"title" : "", "message" : ""};
        $http.post('/has',data).success(function(response) {
            if(response.responseCode === 0) {
                message.title = "Uspeh !";
                message.message = "Ponuda je uspešno napravljena.";
                data["id"] = response.data.generated_keys[0];
                $scope.foodData.push(data);
            } else {
                message.title = "Greška !";
                message.message = "Greška u toku pravljenja ponude.";
            }
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title(message.title)
                    .textContent(message.message)
                    .ok('U redu.')
                    .targetEvent(ev)
            );
        });
    }

    $scope.updateVote = function(index) {
        var data = {
            "id" : $scope.foodData[index].id,
            "option" : $scope.foodData[index].selected
        };
        $http.put("/has",data).success(function(response) {
            if(response.responseCode === 0) {
                console.log("Success");
                $scope.hiddenrows.push(index);
            } else {
                console.log("error");
            }
        });

        alert = $mdDialog.alert({
            title: 'Uspeh',
            textContent: 'Narudžba je primljena.',
            ok: 'U redu.'
        });

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
                location.reload();
            });
    }

    $scope.delete = function(index) {
        $http({
            method: 'DELETE',
            url: '/has/',
            data: {
                "id" : $scope.foodData[index],
                "option" : $scope.foodData[index]
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        })
            .then(function(response) {
                console.log(response.data);
            }, function(rejection) {
                console.log(rejection.data);
            });

        alert = $mdDialog.alert({
            title: 'Uspeh',
            textContent: 'Podaci uspešno izbrisani.',
            ok: 'U redu.'
        });

        $mdDialog
            .show( alert )
            .finally(function() {
                alert = undefined;
                location.reload();
            });
    };

    socket.on('changeFeed',function(data) {
        for(var foodCounter = 0; foodCounter < $scope.foodData.length; foodCounter++) {
            if($scope.foodData[foodCounter].id === data.id) {
                $scope.foodData[foodCounter].hrana = data.hrana;
                $scope.$apply();
            }
        }
    });
});
