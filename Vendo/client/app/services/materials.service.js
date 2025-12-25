(function () {

    angular
      .module('app.table')
      .service('materials', materials);

    materials.$inject = ['$http', '$window', '$mdDialog', '$mdToast', 'config'];

    function materials($http, $window, $mdDialog, $mdToast, config) {

        alert = function (content) {
            return $mdDialog.show(
                 $mdDialog.alert()
                     .parent(angular.element(document.querySelector('#popupContainer')))
                     .clickOutsideToClose(true)
                     .title("Alert")
                     .content(content)
                     .ariaLabel('Alert Dialog Demo')
                     .ok('Got it!')
                     .targetEvent()
             );
        };

        cancelConfirm = function (content) {
            return $mdDialog.confirm()
                        .title('Are you sure want to Cancel this ' + content + '?')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('Yes')
                        .cancel('No');
        };

        deleteConfirm = function (content) {
            return $mdDialog.confirm()
                        .title('Would you like to delete your ' + content + '?')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('Yes')
                        .cancel('No');
        };

       approveConfirm = function (content) {
            return $mdDialog.confirm()
                        .title('Would you like to approve ' + content + '?')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('Yes')
                        .cancel('No');
        };

        editConfirm = function (content) {
            return $mdDialog.confirm()
                        .title('Would you like to move to InProgress ' + content + '?')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('Yes')
                        .cancel('No');
        };

        displayToast = function (type, content) {
           
            $mdToast.show({
                controller: 'MaterialsCtrl',
                template: '<md-toast class="md-toast-' + type + '">'
                            + ' <span flex>' + content + '</span>'
                                   + ' <md-button ng-click="closeToast()">'
                                    + '    Close'
                                   + ' </md-button>'
                               + '</md-toast>',
                hideDelay: 3000,
                position: 'bottom right'
            });
        };

        showSpinner = function () {
            $mdDialog.show({
                template: '<md-dialog style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                            //'<div><img src="' + config.clientUrl + 'app/images/loader.gif" style="height:100px;width:100px" > </div>' +

                                '<md-progress-circular md-diameter="90" md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
            });
        };

        hideSpinner = function () {
            $mdDialog.hide();
        };

        date_MMDDYYYY = function (d) {
            var mm = d.getMonth() + 1;
            var dd = d.getDate();
            if (mm < 10) mm = "0" + mm;
            if (dd < 10) dd = "0" + dd;
            return mm + "/" + dd + "/" + d.getFullYear();
        };

        numberWithCommas = function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(value) {
                return (angular.lowercase(value.display).indexOf(lowercaseQuery) === 0);
            };
        }

        groupBy = function (collection, property) {

            var i = 0, val, index,
                values = [], result = [];
            for (; i < collection.length; i++) {
                val = property == "date" ? ConvertRatingDate(new Date(collection[i]['date'])) : collection[i][property];
                index = values.indexOf(val);
                if (index > -1)
                    result[index].push(collection[i]);
                else {
                    values.push(val);
                    result.push([collection[i]]);
                }
            }
            return result;
        }


        splitCollection = function (arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        function convertdatetime(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var hour = dat.getHours().toString();
            hour = hour.length > 1 ? hour : '0' + hour;
            var min = dat.getMinutes().toString();
            min = min.length > 1 ? min : '0' + min;
            var sec = dat.getSeconds().toString();
            sec = sec.length > 1 ? sec : '0' + sec;

            DatePart = month + day + year;
            return day + '/' + month + '/' + year + " " + hour + ":" + min + ":" + sec;
        }


        function stockconvertdatetime(dat,staus) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var hour = dat.getHours().toString();
            hour = hour.length > 1 ? hour : '0' + hour;
            var min = dat.getMinutes().toString();
            min = min.length > 1 ? min : '0' + min;
            var sec = dat.getSeconds().toString();
            sec = sec.length > 1 ? sec : '0' + sec;

            DatePart = month + day + year;
            var dateformat;
            switch (staus) {
                case "F":
                    dateformat= day + '/' + month + '/' + year + " "+ "00:00:00";
                    break;
                case "T":
                    dateformat= day + '/' + month + '/' + year + " " +"23:59:59";
                    break;
                case "D":
                    dateformat = day + '/' + month + '/' + year;
            }
            return dateformat;
        }

        function ConvertRatingDate(dat) {

            var year = dat.getFullYear();
            var month = (1 + dat.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = dat.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            DatePart = month + day + year;
            return day + '/' + month + '/' + year;
        }

        function removeTimeFromDate(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        getaccess = function (pageid) {
            var _page = {};
            var userpermission = sessionStorage.userpermission;
            if (userpermission != "") {
                var lstdata = JSON.parse(userpermission);
                var lstPages = lstdata.listrolepages;
                for (var i = 0; i < lstPages.length; i++) {
                    if (pageid == lstPages[i].pageid) {
                        _page = lstPages[i];
                        break;
                    }
                }
            }
           
            return _page;
        }



        return {
            alert: alert,
            deleteConfirm: deleteConfirm,
            approveConfirm:approveConfirm,
            editConfirm: editConfirm,
            displayToast: displayToast,
            date_MMDDYYYY: date_MMDDYYYY,
            numberWithCommas: numberWithCommas,
            createFilterFor: createFilterFor,
            showSpinner: showSpinner,
            hideSpinner: hideSpinner,
            groupBy: groupBy,
            convertdatetime: convertdatetime,
            stockconvertdatetime: stockconvertdatetime,
            splitCollection: splitCollection,
            removeTimeFromDate: removeTimeFromDate,
            getaccess: getaccess,
            cancelConfirm: cancelConfirm
        };
    }

    angular.module('app.table').controller('MaterialsCtrl', ['$scope', '$mdToast', MaterialsCtrl]);

    function MaterialsCtrl($scope, $mdToast) {
        $scope.closeToast = function () {
            $mdToast.hide();
        };
    }
})();