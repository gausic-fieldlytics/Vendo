(function () {
    'use strict';

    angular.module('app.table').
        controller('TrackingCtrl', ['$q', '$rootScope', '$scope', '$http', '$filter', '$mdDialog', 'config', 'appConstants', 'service', 'materials', 'trackingModel', 'commonModel', TrackingCtrl]);

    function TrackingCtrl($q,$rootScope, $scope, $http, $filter, $mdDialog, config, appConstants, service, materials, trackingModel, commonModel) {
        var dashboardmap;
        var carpath = "M162 1077 c8 -5 3 -7 -14 -3 -62 14 -77 -74 -70 -408 l5 -238 -22 7 c-27 8 -29 -20 -2 -35 18 -9 19 -19 15 -115 -5 -115 5 -153 47 -192 65 -58 264 -58 327 0 48 44 55 73 49 189 -5 100 -4 109 14 118 27 15 26 43 -2 35 -20 -7 -21 -7 -13 227 7 252 -2 359 -36 401 -17 21 -25 22 -164 23 -90 0 -141 -3 -134 -9z m-15 -119 c-1 -51 2 -104 5 -119 7 -25 9 -25 73 -18 35 3 91 4 122 0 l58 -6 3 -142 c2 -137 2 -142 -19 -154 -33 -17 -160 -14 -197 5 -31 16 -32 19 -32 82 0 36 -3 63 -8 61 -4 -3 -8 21 -8 54 -1 32 -4 73 -6 89 -3 17 -6 40 -7 53 -2 21 -3 21 -10 2 -5 -11 -4 -28 1 -39 7 -12 7 -21 0 -25 -7 -4 -11 -76 -10 -201 0 -185 1 -192 14 -140 7 30 14 71 15 90 2 34 2 34 6 6 6 -42 -27 -194 -43 -200 -10 -4 -14 3 -14 19 0 15 -7 26 -20 30 -11 3 -20 11 -20 16 0 6 8 5 21 -1 l20 -11 -3 291 c-1 198 1 293 8 298 6 4 16 17 23 30 22 41 29 23 28 -70z m307 66 c6 -10 16 -22 21 -26 6 -5 9 -113 8 -298 -3 -287 -2 -290 17 -280 26 14 26 -1 0 -18 -11 -7 -20 -22 -20 -34 0 -19 -2 -20 -14 -8 -17 19 -46 143 -45 190 0 22 6 6 15 -45 20 -112 34 -116 28 -9 -3 49 -5 153 -5 232 0 132 -8 174 -23 120 -9 -36 -7 -50 7 -42 9 6 9 5 0 -7 -7 -8 -14 -44 -16 -79 -2 -36 -3 24 -3 132 1 192 5 217 30 172z";
        $scope.listonlinedriver = [];
        $scope.listonlinedrivermarker = [];
        $scope.history = {};
        $scope.history.fromdate = new Date();
        $scope.history.todate = new Date();
        $scope.listtriphistory = [];
        var path = [], pathmarkerpush=[];
        var flightPath;
        $scope.listlivetracking = [];

        var mapTypeIds = [], array = [];
        for (var type in google.maps.MapTypeId) {
            mapTypeIds.push(google.maps.MapTypeId[type]);
        }
        mapTypeIds.push("OSM");


        function loadmap(lat, lng) {
            var element = document.getElementById('map_canvas');
            dashboardmap = new google.maps.Map(element, {
                center: new google.maps.LatLng(lat, lng),
                zoom: 8,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    mapTypeIds: mapTypeIds,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                fullscreenControl: true,
            });

            dashboardmap.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function (coord, zoom) {
                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 19
            }));
        }
        loadmap("13.120690", "80.203438");


        function loadonlineuser() {
            var obj = {};
            var result = service.serverPost(config.urlGetonlineuser, trackingModel.onlinedriver, "", obj)
            result.then(function (resolve) {
                $scope.listonlinedriver = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        loadonlineuser();
     
        $scope.addmarker = function () {
            debugger;
            for (var i = 0; i < $scope.listonlinedrivermarker.length; i++) {
                $scope.listonlinedrivermarker[i].setMap(null);
            }
            $scope.listonlinedrivermarker = [];
            var ismarkeradd = false;
            var latlngbounds = new google.maps.LatLngBounds();

            for (var i = 0; i < $scope.listonlinedriver.length; i++) {
                if ($scope.listonlinedriver[i].status) {

                    var position = new google.maps.LatLng($scope.listonlinedriver[i].lat, $scope.listonlinedriver[i].lng);
                    var color = 'Green';
                    
                    var marker = new google.maps.Marker({
                        position: position,
                        map: dashboardmap,
                        title: $scope.listonlinedriver[i].firstname,
                        userid: $scope.listonlinedriver[i].id,
                        icon: {
                            path: carpath,
                            scale: 0.035,
                            rotation: parseInt($scope.listonlinedriver[i].direction),
                            fillColor: color,
                            fillOpacity: 1,
                            strokeWeight: 0.9,
                            strokeColor: '#000000',
                        },
                    });
                    latlngbounds.extend(marker.getPosition());

                    $scope.listonlinedrivermarker.push(marker);
                    ismarkeradd = true;
                }
            }

            if (ismarkeradd) {
                dashboardmap.fitBounds(latlngbounds);
            }
        }


        $rootScope.$on('tracking_signalR', function (event, args) {
            debugger;
            if (args != "" && args != null) {
                var data = JSON.parse(args.data);
                for (var i = 0; i < $scope.listonlinedriver.length; i++) {
                    if ($scope.listonlinedriver[i].id == data.u_userid) {
                        $scope.listonlinedriver[i].newlat = $scope.listonlinedriver[i].newlat != undefined ? $scope.listonlinedriver[i].newlat : $scope.listonlinedriver[i].lat;
                        $scope.listonlinedriver[i].newlng = $scope.listonlinedriver[i].newlng != undefined ? $scope.listonlinedriver[i].newlng : $scope.listonlinedriver[i].lng;

                        var movemarker = $.grep($scope.listonlinedrivermarker, function (obj) {
                            return obj.userid == data.u_userid;
                        })[0];
                        if (movemarker != undefined) {
                            loadtrack($scope.listonlinedriver[i], data, i, movemarker);
                        }
                        
                    }
                }
                
            }
            
        });

        function loadtrack(user, data, idx, movemarker) {
            if (data.u_latitude != user.newlat || data.u_longitude != user.newlng) {
                debugger;
                var latlng = new google.maps.LatLng(data.u_latitude, data.u_longitude);
                var prelatlng = new google.maps.LatLng(user.newlat, user.newlng);
                //selectedmarker.newlat = data.lat;
                //selectedmarker.newlng = data.lng;

                $scope.listonlinedriver[idx].newlat = data.u_latitude;
                $scope.listonlinedriver[idx].newlng = data.u_longitude;

                var color = 'Green';
               

                movemarker.icon.rotation = data.u_direction;
                movemarker.icon.fillColor = color;
                movemarker.rotation = parseFloat(data.u_direction);

                var result = [data.u_latitude, data.u_longitude];
                var distance = google.maps.geometry.spherical.computeDistanceBetween(prelatlng, latlng) / 1000;

                smoothmove(movemarker, data.u_latitude, data.u_longitude, data.u_direction, distance, prelatlng, latlng)
            }
        }
        
        function smoothmove(marker, lat, lng, direction, distance, currentPos, nextPos) {
            debugger;
            var spherical = google.maps.geometry.spherical;
            var fraction = 0;
            var direction = direction;
            var steps = direction;
            var fractionStep = 1 / steps;
            var distance = distance;
          //  this.previouslatlng = { lat: lat, lng: lng };
            var animateTimer = setInterval(function () {
                fraction += fractionStep;
                marker.setPosition(
                  spherical.interpolate(
                    currentPos,
                    nextPos,
                    fraction
                  )
                );
                if (fraction >= 1.0) {
                    clearInterval(animateTimer);
                    animateTimer = null;
                }
                dashboardmap.panTo(marker.getPosition());
            }, 2000 / steps);
          //  movemarker.rotation = direction;
        }


        $scope.loadhistory = function () {
            debugger;
            var obj = {};
            obj.fromdate = new Date();
            obj.todate = new Date();
            var result = service.serverPost(config.urlGetLocation, trackingModel.history, "", obj)
            result.then(function (resolve) {
                $scope.listtriphistory = resolve.ResponseData;
            }, function (reject) {
                alert('Not Resolved')
            });
        }
        $scope.loadhistory();

       
        function clearmarkersAndPloyline() {
            path = [];
            if (pathmarkerpush != undefined && pathmarkerpush != null) {
                for (var i = 0; i < pathmarkerpush.length; i++) {
                    pathmarkerpush[i].setMap(null);
                }
            }

            if (flightPath != undefined)
            { flightPath.setMap(null); }
        }

        $scope.gethistory = function (loc) {
            debugger;
            clearmarkersAndPloyline();

           // var loc = resolve.ResponseData.locationdata;
            $scope.LatLng = loc.split("#");
            var markers = [];
            var Polypath = [];
            var latlngbounds = new google.maps.LatLngBounds()
            for (var c = 0; c < $scope.LatLng.length; c++) {
                var latlng = $scope.LatLng[c].split(",");
                var position = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
                var icon = c == 0 ? "vehiclestatusicon/start.png" : (c == $scope.LatLng.length - 1 ? "vehiclestatusicon/end.png" : "vehiclestatusicon/Active.png");
                Polypath.push({ lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1]) });
                var marker = new google.maps.Marker({
                    position: position,
                    icon: icon,
                    zoom: 19,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    map: dashboardmap,
                });
                pathmarkerpush.push(marker);
                latlngbounds.extend(marker.position);
            }
            flightPath = new google.maps.Polyline({
                path: Polypath,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(dashboardmap);
           
            var bounds = new google.maps.LatLngBounds();
            var points = flightPath.getPath().getArray();
            for (var n = 0; n < points.length ; n++) {
                bounds.extend(points[n]);
            }
          //  dashboardmap.fitBounds(bounds);
            dashboardmap.panTo(position);
        }
    }
})();


