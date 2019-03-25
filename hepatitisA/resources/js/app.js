var haApp = angular.module('haApp', ['ionic', 'ngSanitize']);

haApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider){
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    $httpProvider.defaults.headers.post['Access-Control-Allow-Methods'] = 'DELETE, POST, GET, OPTIONS';
    $httpProvider.defaults.headers.post['Access-Control-Allow-Headers'] = 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

});

//过滤器
haApp.filter('timeFilter', function () {
    return function (obj) {
        if(obj === ''){
            return '';
        }else{
            return obj.substring(11, 16);
        }

    };
}).filter('sportsTimeFilter', function () {
    return function (obj) {
        if(obj < 60){
            return obj + '分钟';
        }else{
            return obj/60 + '小时';
        }

    }
}).filter('formLabelFilter', function () {
    return function (obj) {
        var DisplayName = obj.DisplayName;
        var ItemDisplay = obj.ItemDisplay;
        var json = JSON.parse(ItemDisplay);
        var TagHtmlContext = json.TagHtmlContext;

        if(TagHtmlContext === '' || TagHtmlContext === undefined){
            return DisplayName;
        }else{
            return unescape(TagHtmlContext);
        }

    }
}).filter('formAnnotationFilter', function () {
    return function (obj) {
        var TagHtmlContext = obj;

        if(TagHtmlContext === '' || TagHtmlContext === undefined){
            return '';
        }else{
            return unescape(TagHtmlContext);
        }

    }
}).filter('formToFloatFilter', function () {
    return function (obj) {
        return parseFloat(obj);
    }
});