(function($){
"use strict";

$.jB.namespace("$.jB.util");

$.extend($.jB.util,{
    intersect : function(params,obj) {
        if (params === undefined) {
            throw {
                name : "Intersect Error",
                level : "Critical",
                message : "Params must be defined"
                };
        }
        
        if (params.constructor === Object) {
            params = $.jB.util.getObjectKeys(params);
        }
        var newObj = {};
        $.each(params, function(index,item){
            if (obj[item] !== undefined) {
                newObj[item] = obj[item];
            }
        });

        return newObj;
    },
    filter : function(params,obj) {
        if (params.constructor === Object) {
            params = $.jB.util.getObjectKeys(params);
        }
        var newObj = {};
        $.each(obj, function(index,item){
            if ($.inArray(index,params) === -1 && (item.constructor === String || item.constructor === Object || 
                item.constructor === Number || item.constructor === Array)) {
                newObj[index] = item;
            }
        });

        return newObj;
    },
    getObjectKeys : function(obj) {
        var keys = [], key;
        for (key in obj) {
            keys.push(key);
        }
        return keys;
    }
});
})(jQuery);