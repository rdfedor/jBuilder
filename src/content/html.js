(function($){
$.jB.extend("content.html", {
    alias : "html",

    attributes : ["id","class", "style"],

    'class' : "",

    doLayout : function() {
        var that = this;

        this.element = $("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (this.url !== undefined) {
            $.get(this.url, function(data) {
                that.element.html(data);
                that.element.parent().parent().trigger("onRender");
            });
        } else {
            this.element.html(this.text);
        }

        return this.element;
    }
});
})(jQuery);