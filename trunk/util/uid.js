(function($){
    $.jB.namespace("$.jB.util");
    $.extend($.jB.util,{
        elementCount : 0,

        generateUID : function() {
            return "jB" + (1000 + $.jB.util.elementCount++);
        },
        getJBID : function(obj) {
            var jBID = obj.attr("class").match(/jB[\d]{4}/);
            return jBID !== undefined ? jBID[0] : undefined;
        }
    });
})(jQuery);