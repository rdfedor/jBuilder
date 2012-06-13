jQuery.extend(jQuery.jBuilder,{
    intersect : function(obj,params) {
        var newObj = obj.constructor();
        jQuery.each(params, function(index,item){
            if (obj[item] !== undefined) {
                newObj[item] = obj[item];
            }
        });

        return newObj;
    },
    filter : function(obj,params) {
        var newObj = {};
        jQuery.each(obj, function(index,item){
            if (jQuery.inArray(index,params) == -1 && (item.constructor == String || item.constructor == Object
                || item.constructor == Number || item.constructor == Array)) {
                newObj[index] = item;
            }
        });

        return newObj;
    }
});