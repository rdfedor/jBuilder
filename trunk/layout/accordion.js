jQuery.jBuilder.extend("layout.accordion", {
    layout : "accordion",

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

        var that = this;

        this.element = jQuery("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (!jQuery.isArray(this.items)) {
            this.items = [this.items];
        }

        jQuery.each(this.items,function(index,obj) {
            jQuery("<h3>").html(jQuery("<a>").attr("href","#").html(obj.label))
                .add(jQuery("<div>").html(jQuery.jBuilder.doLayout(obj, that.defaults)))
                .appendTo(that.element);
        });

        this.element.accordion({autoHeight: false});

        return this.element;
    }
});