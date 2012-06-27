(function($){
$.extend($.jB,{
    elementCount : 0,

    generateUID : function() {
        return "jB" + (1000 + $.jB.elementCount++);
    },
    getJBID : function(obj) {
        return this.attr("class").match(/jB[\d]{4}/);
    }
});
})(jQuery);