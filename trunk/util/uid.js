jQuery.extend(jQuery.jBuilder,{
    elementCount : 0,

    generateUID : function() {
        return "jB" + (1000 + jQuery.jBuilder.elementCount++);
    },
    getJBID : function(obj) {
        return this.attr("class").match(/jB[\d]{4}/);
    }
});