(function($){
$.extend($.jB,{
    intersect : function(params,obj) {
        var newObj = {};
        $.each(params, function(index,item){
            if (obj[item] !== undefined) {
                newObj[item] = obj[item];
            }
        });

        return newObj;
    },
    filter : function(params,obj) {
        var newObj = {};
        $.each(obj, function(index,item){
            if ($.inArray(index,params) == -1 && (item.constructor == String || item.constructor == Object
                || item.constructor == Number || item.constructor == Array)) {
                newObj[index] = item;
            }
        });

        return newObj;
    }
});
})(jQuery);