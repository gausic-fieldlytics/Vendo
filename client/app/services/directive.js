(function () {

    angular
      .module('app.table')
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9-]/g, '');
                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        }).directive('allowDecimalNumbers', function () {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs, ctrl) {
                    elm.on('keydown', function (event) {
                        var $input = $(this);
                        var value = $input.val();
                        value = value.replace(/[^0-9\.]/g, '')
                        $input.val(value);
                        if (event.which == 64 || event.which == 16) {
                            // numbers  
                            return false;
                        } if ([8, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {
                            // backspace, enter, escape, arrows  
                            return true;
                        } else if (event.which >= 48 && event.which <= 57) {
                            // numbers  
                            return true;
                        } else if (event.which >= 96 && event.which <= 105) {
                            // numpad number  
                            return true;
                        } else if ([46, 110, 190].indexOf(event.which) > -1) {
                            // dot and numpad dot  
                            return true;
                        } else {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
        }).directive('capitalize', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, modelCtrl) {
                    var capitalize = function (inputValue) {
                        if (inputValue == undefined) inputValue = '';
                        var capitalized = inputValue.toUpperCase();
                        if (capitalized !== inputValue) {
                            // see where the cursor is before the update so that we can set it back
                            var selection = element[0].selectionStart;
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                            // set back the cursor after rendering
                            element[0].selectionStart = selection;
                            element[0].selectionEnd = selection;
                        }
                        return capitalized;
                    }
                    modelCtrl.$parsers.push(capitalize);
                    capitalize(scope[attrs.ngModel]); // capitalize initial value
                }
            };
        }).directive('numberConverter', function () {
            return {
                priority: 1,
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attr, ngModel) {
                    //function toModel(value) {
                    //    return "" + value; // convert to string
                    //}

                    function toView(value) {

                        return parseFloat(value); // convert to number
                    }

                    ngModel.$formatters.push(toView);
                    ngModel.$parsers.push(toModel);
                }
            };
        }).directive('onErrorSrc', function () {
            return {
                link: function (scope, element, attrs) {
                    element.bind('error', function () {
                        if (attrs.src != attrs.onErrorSrc) {
                            attrs.$set('src', attrs.onErrorSrc);
                        }
                    });
                }
            }
        }).directive('loading', ['$http', function ($http) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };
                    scope.$watch(scope.isLoading, function (value) {
                        if (value) {
                            element.removeClass('ng-hide');
                        } else {
                            element.addClass('ng-hide');
                        }
                    });
                }
            }
        }]).directive('validNumber', function() {
            return {
              require: '?ngModel',
              link: function(scope, element, attrs, ngModelCtrl) {
                if(!ngModelCtrl) {
                  return; 
                }
      
                ngModelCtrl.$parsers.push(function(val) {
                  if (angular.isUndefined(val)) {
                      var val = '';
                  }
                  
                  var clean = val.replace(/[^-0-9\.]/g, '');
                  var negativeCheck = clean.split('-');
                  var decimalCheck = clean.split('.');
                  if(!angular.isUndefined(negativeCheck[1])) {
                      negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                      clean =negativeCheck[0] + '-' + negativeCheck[1];
                      if(negativeCheck[0].length > 0) {
                          clean =negativeCheck[0];
                      }
                      
                  }
                    
                  if(!angular.isUndefined(decimalCheck[1])) {
                      decimalCheck[1] = decimalCheck[1].slice(0,2);
                      clean =decimalCheck[0] + '.' + decimalCheck[1];
                  }
      
                  if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                  }
                  return clean;
                });
      
                element.bind('keypress', function(event) {
                  if(event.keyCode === 32) {
                    event.preventDefault();
                  }
                });
              }
            };
          })
})();