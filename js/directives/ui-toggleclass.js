angular.module('app')
    .directive('backgroundImage', function() {
        return function(scope, element, attrs) {
            restrict: 'A',
            attrs.$observe('backgroundImage', function(value) {
                element.css({
                    'background-image': 'url(' + value + ')'
                });
            });
        };
    })

    .directive('emptyTypeahead', function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
          // this parser run before typeahead's parser
          modelCtrl.$parsers.unshift(function (inputValue) {
            var value = (inputValue ? inputValue : '[$empty$]'); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
            modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
            return value;
          });
          
          // this parser run after typeahead's parser
          modelCtrl.$parsers.push(function (inputValue) {
            return inputValue === '[$empty$]' ? '' : inputValue; // set the secretEmptyKey back to empty string
          });
        }
      }
    })

    .directive('focusMe', function($timeout, $parse) {
      return {
          //scope: true,   // optionally create a child scope
          link: function(scope, element, attrs) {
              var model = $parse(attrs.focusMe);
              scope.$watch(model, function(value) {
                  if(value === true) { 
                      $timeout(function() {
                          element[0].focus();
                      });
                  }
              });
          }
      };
    })

.directive('popoverClose', function($timeout) {
        return {
            scope: {
                excludeClass: '@'
            },
            link: function(scope, element, attrs) {
                var trigger = document.getElementsByClassName('trigger');

                function closeTrigger(i) {
                    $timeout(function() {
                        angular.element(trigger[0]).triggerHandler('click').removeClass('trigger');
                    });
                }

                element.on('click', function(event) {
                    var etarget = angular.element(event.target);
                    var tlength = trigger.length;
                    if (!etarget.hasClass('trigger') && !etarget.hasClass(scope.excludeClass)) {
                        for (var i = 0; i < tlength; i++) {
                            closeTrigger(i)
                        }
                    }
                });
            }
        };
    })
    .directive('popoverElem', function() {
        return {
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    element.addClass('trigger');
                });
            }
        };
    })

.filter('shortNumber', function() {
    return function(number) {
        if (number) {
            abs = Math.abs(number);
            if (abs >= Math.pow(10, 12)) {
                // trillion
                number = (number / Math.pow(10, 12)).toFixed(1) + "T";
            } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                // billion
                number = (number / Math.pow(10, 9)).toFixed(1) + "B";
            } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                // million
                number = (number / Math.pow(10, 6)).toFixed(1) + "M";
            } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                // thousand
                number = (number / Math.pow(10, 3)).toFixed(1) + "K";
            }
            console.log(number);
            return number;
        }
    };
})

.directive("limitToMax", function() {
    return {
        link: function(scope, element, attributes) {
            element.on("keydown keyup", function(e) {
                if (Number(element.val()) > Number(attributes.max) &&
                    e.keyCode != 46 // delete
                    &&
                    e.keyCode != 8 // backspace
                ) {
                    e.preventDefault();
                    element.val(attributes.max);
                }
            });
        }
    };
})

.directive("preventTypingGreater", function() {
        return {
            link: function(scope, element, attributes) {
                var oldVal = null;
                element.on("keydown keyup", function(e) {
                    if (Number(element.val()) > Number(attributes.max) &&
                        e.keyCode != 46 // delete
                        &&
                        e.keyCode != 8 // backspace
                    ) {
                        e.preventDefault();
                        element.val(oldVal);
                    } else {
                        oldVal = Number(element.val());
                    }
                });
            }
        };
    })
    .filter('noFractionCurrency', ['$filter', '$locale',
        function(filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            return function(amount, currencySymbol) {
                var value = currencyFilter(amount, currencySymbol);
                var sep = value.indexOf(formats.DECIMAL_SEP);
                if (amount >= 0) {
                    return value.substring(0, sep);
                }
                return value.substring(0, sep) + ')';
            };
        }
    ])

.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "mm/dd/yy",
        autoSize: true,
        changeYear: true,
        changeMonth: true,
        appendToBody:true,
        minDate:new Date(),
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      elem.datepicker(options);
    }
  }
})
    .directive('datetimez', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    language: 'en',
                    pickDate: false,
                }).on('changeDate', function(e) {
                    ngModelCtrl.$setViewValue(e.date);
                    scope.$apply();
                });
            }
        };
    })

.directive('soundCloudPlayer', function() {
    return {
        restrict: 'E',
        template: '<iframe width="100%" height="465" scrolling="no" frameborder="no"></iframe>',
        link: function(scope, element, attrs) {
            var iframe = element.find('iframe');
            var settings = [
                'buying=false',
                'liking=false',
                'download=false',
                'sharing=false',
                'show_artwork=true',
                'show_comments=false',
                'show_playcount=true',
                'show_user=true',
                'hide_related=true',
                'visual=true',
                'start_track=0',
                'callback=true'
            ];
            var url = attrs.url + '?' + settings.join('&');
            iframe.attr('src', 'https://w.soundcloud.com/player/?url=' + url);
            SC.Widget(iframe.get(0));
        }
    };
})

.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('escKey', function() {
    return function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
            if (event.which === 27) { // 27 = esc key
                scope.$apply(function() {
                    scope.$eval(attrs.escKey);
                });
                event.stopPropagation();
                event.preventDefault();
            }
        });
    };
})

.directive("bnSlideShow", function() {
    // I allow an instance of the directive to be hooked into the user-interaction model outside of the AngularJS context.
    function link($scope, element, attributes) {
        // I am the TRUTHY expression to watch.
        var expression = attributes.bnSlideShow;
        // I am the optional slide duration.
        var duration = (attributes.slideShowDuration || "fast");

        // I check to see the default display of the element based on the link-time value of the model we are watching.
        if (!$scope.$eval(expression)) {
            element.hide();
        }

        // I watch the expression in $scope context to see when it changes - and adjust the visibility of the element accordingly.
        $scope.$watch(expression, function(newValue, oldValue) {
            // Ignore first-run values since we've already defaulted the element state.
            if (newValue === oldValue) {
                return;
            }
            element.stop(true, true).slideToggle(duration);
        });
    }

    // Return the directive configuration.
    return ({
        link: link,
        restrict: "A"
    });
})

.animation('.slide-toggle-js', function() {
    return {
        enter: function(element, done) {
            $(element).hide().slideDown(function() {
                done();
            });
        },
        leave: function(element, done) {
            $(element).slideUp(function() {
                done();
            });
        }
    };
})

.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

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
})

.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }

                var clean = val.replace(/[^-0-9\.]/g, '');
                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');
                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }

                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
})

.filter('dateToISO', function() {
        return function(input) {
            if (input) {
                input = new Date(input).toISOString();
                return input;
            }
        };
    })
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '\n') : '';
        };
    })
    .filter('cut', function() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '');
        };
    })
    .directive('slideable', function() {
        return {
            restrict: 'C',
            compile: function(element, attr) {
                // wrap tag
                var contents = element.html();
                element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

                return function postLink(scope, element, attrs) {
                    // default properties
                    attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                    attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                    element.css({
                        'overflow': 'hidden',
                        'height': '0px',
                        'transitionProperty': 'height',
                        'transitionDuration': attrs.duration,
                        'transitionTimingFunction': attrs.easing
                    });
                };
            }
        };
    })
    .directive('slideToggle', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var target = document.querySelector(attrs.slideToggle);
                attrs.expanded = false;
                element.bind('click', function() {
                    var content = target.querySelector('.slideable_content');
                    if (!attrs.expanded) {
                        content.style.border = '1px solid rgba(0,0,0,0)';
                        var y = content.clientHeight;
                        content.style.border = 0;
                        target.style.height = y + 'px';
                    } else {
                        target.style.height = '0px';
                    }
                    attrs.expanded = !attrs.expanded;
                });
            }
        }
    })
    .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                el.on('click', function(e) {
                    e.preventDefault();
                    var classes = attr.uiToggleClass.split(','),
                        targets = (attr.target && attr.target.split(',')) || Array(el),
                        key = 0;
                    angular.forEach(classes, function(_class) {
                        var target = targets[(targets.length && key)];
                        (_class.indexOf('*') !== -1) && magic(_class, target);
                        $(target).toggleClass(_class);
                        key++;
                    });
                    $(el).toggleClass('active');

                    function magic(_class, target) {
                        var patt = new RegExp('\\s' +
                            _class.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
                            '\\s', 'g');
                        var cn = ' ' + $(target)[0].className + ' ';
                        while (patt.test(cn)) {
                            cn = cn.replace(patt, ' ');
                        }
                        $(target)[0].className = $.trim(cn);
                    }
                });
            }
        };
    }])
    .directive('myUiSelect', function() {
        return {
            require: 'uiSelect',
            link: function(scope, element, attrs, $select) {
                scope.$on('closeAll', (ev, val) => {
                    $select.close();
                });
            }
        };
    })
    .service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
})

    .directive('scrollToBottom', function($timeout, $window) {
    return {
        scope: {
            scrollToBottom: "="
        },
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.$watchCollection('scrollToBottom', function(newVal) {
                if (newVal) {
                    $timeout(function() {
                        element[0].scrollTop =  element[0].scrollHeight;
                    }, 0);
                }

            });
        }
    };
})
    .directive('resize', function($window) {
        return function(scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function() {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function() {
                scope.$apply();
            });
        }
    });