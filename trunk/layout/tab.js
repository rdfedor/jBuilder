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
            var body = jQuery.jBuilder.doLayout(jQuery.jBuilder.filter(['height', 'width'],obj), this.defaults);
            var tabID = body.attr("class").match(/jB[\d]{4}/)[0];
            jQuery("<li>").append(jQuery("<a>").attr("href", "#" + tabID).html(obj.label)).appendTo(tabHeader);
            var bodyContainer = jQuery("<div>").css({overflow : "hidden"})
                .css(jQuery.jBuilder.intersect(['height', 'width'],obj)).append(body);
            tabBody = tabBody.add(jQuery("<div>").html(bodyContainer).attr("id", tabID).css({position : "relative"}));
            jQuery(document).bind("afterRender",function() {
                that.element.tabs("select",index);
                if (bodyContainer.height() < body.height()) {
                    jQuery("<div>").css({position:"absolute", top : 20, right : 4, height: "90%"}).slider({
                        orientation : "vertical",
                        value : 100,
                        slide: function( event, ui ) {
                            if ( body.height() > bodyContainer.height() ) {
                                body.css( "margin-top", Math.round(
                                    (100 - ui.value) / 100 * ( bodyContainer.height() - body.height() - 20 )
                                ) + "px" );
                            } else {
                                body.css( "margin-top", 0 );
                            }
                        }
                    }).appendTo(bodyContainer.parent());
                }
                if (index == that.element.tabs("length") - 1) {
                    that.element.tabs("select", 0);
                }
            });
        });

        this.element.append(tabHeader).append(tabBody).tabs();

        return this.element;
    }
});