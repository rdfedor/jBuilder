jQuery.jBuilder.extend("layout.tab", {
    layout : "tab",

    tpl : "<div #attr#><ul>#tabMenu#</ul>#body#</div>",
    tabMenuTpl : "<li><a href=\"##tabID#\">#label#</a></li>",

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

        this.class = this.buildClassAttr();

        var that = this;
        jQuery(document).bind("afterRender",function() {
            jQuery("div." + that.eleID).tabs();
            jQuery(document).unbind("afterRender", this);
        });

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        var body = [],
            tabMenu = [];
        jQuery.each(this.items,function(index,obj) {
            var html = jQuery("<div>" +jQuery.jBuilder.doLayout(obj, this.defaults) + "</div>");
            var tabID = html.children().attr("class").match(/jB[\d]{4}/)[0];
            html.children().attr("id",tabID);
            body.push(html.html());
            tabMenu.push(that.tabMenuTpl.replace("#tabID#",tabID).replace("#label#",obj.label));
        });

        return this.tpl.replace("#attr#",this.buildElementAttr(this.attributes,this))
            .replace("#tabMenu#",tabMenu.join(""))
            .replace("#body#",body.join(""));
    }
});