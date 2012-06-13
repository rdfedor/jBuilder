jQuery.jBuilder.extend("layout.accordion", {
    layout : "accordion",

    tpl : "<div #attr#>#body#</div>",
    innertpl : "<h3><a href='#'>#label#</a></h3><div>#body#</div>",
    attributes : ["id", "class", "method", "name", "action"],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }
    },

    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        this.class = this.buildClassAttr();

        var that = this;

        jQuery(document).bind("afterRender",function() {
            jQuery("div." + that.eleID).accordion({autoHeight: false});
            jQuery(document).unbind("afterRender", this);
        });

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        var innerBody = [];
        if (!jQuery.isArray(this.items)) {
            this.items = [this.items];
        }
        jQuery.each(this.items,function(index,obj) {
            innerBody.push(that.innertpl.replace("#label#", obj.label)
                .replace("#body#",jQuery.jBuilder.doLayout(obj, this.defaults)));
        });

        return this.tpl.replace("#attr#", this.buildElementAttr(this.attributes,this))
            .replace("#body#", innerBody.join(""));
    }
});