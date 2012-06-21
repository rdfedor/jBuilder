jQuery.jBuilder.extend("content.html", {
    alias : "html",

    tpl : "<div #attr#>#text#</div>",

    attributes : ["id","class", "style"],

    class : "",

    doLayout : function() {
        var that = this;

        this.element = jQuery("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (this.url !== undefined) {
            jQuery.get(this.url, function(data) {
                that.element.html(data);
            });
        } else {
            this.element.html(this.text);
        }

        return this.element;
    }
});