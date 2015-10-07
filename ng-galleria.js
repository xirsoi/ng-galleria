angular.module('com.verico.ng-galleria', [])


    .provider('galleria', function () {
        var path;
        this.setPath = function(input){
            path = input;
        };
        this.$get = function galleriaFactory(){
            return {
                path: path
            };
        };
    })

    .directive('ngGalleria', function () {
        return {
            restrict: 'E',
            controller: function galleriaDirectiveCtrl($scope, $element, $timeout) {

                var  isPhoneGap = function() {
                    return (document.location.protocol == "file:");
                };

                //Detect if cordova is running
                if (!isPhoneGap()) {
                    Galleria.loadTheme(galleria.path);
                }else{
                    Galleria.loadTheme('../../'+galleria.path);
                }


                var obj = $element.find('.galleria');
                Galleria.configure({
                    dummy: '/res/img/dummy.gif',
					_toggleInfo: false
                });

                var GalleriaApiReference;
                $timeout(function () {
                    var index = -1;
                    for(var i = 0; i < $scope.source.images.length; i++){
                        if($scope.source.images[i].image === $scope.source.index.image){
                            index = i;
                            break;
                        }
                    }

                    Galleria.run(obj, {
                        show: index,
                        extend: function(){
                            GalleriaApiReference = this;
                        }
                    });
                });

                $scope.$on('$destroy', function() {
                    if(GalleriaApiReference && GalleriaApiReference.destroy)
                        GalleriaApiReference.destroy();
                });
            },
            template: '<div class="galleria" style="height: 100%; width: 100%">' +
                           '<a href="{{img.image}}" ng-repeat="img in source.images">' +
                              '<img src="{{img.thumb}}" data-title="{{img.title}}" data-description="{{img.description}}">' +
                           '</a>' +
                      '</div>',
            scope: {
                source: '='
            }
        };
    });

