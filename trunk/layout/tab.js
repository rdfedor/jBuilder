jQuery.jBuilder.extend("layout.tab", {
    layout : "tab",

    ref : {
        header : "ul li"
    },

    attributes : ["id", "class"],

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

        var tabHeader = jQuery("<ul>");
        var tabBody = jQuery("");

        jQuery.each(this.items,function(index,obj) {
            var body = jQuery.jBuilder.doLayout(obj, this.defaults);
            var tabID = body.attr("class").match(/jB[\d]{4}/)[0];
            jQuery("<li>").append(jQuery("<a>").attr("href", "#" + tabID).html(obj.label)).appendTo(tabHeader);
            tabBody = tabBody.add(jQuery("<div>").attr("id", tabID).append(body));
        });

        this.element.append(tabHeader).append(tabBody).tabs();

        return this.element;
    }
});