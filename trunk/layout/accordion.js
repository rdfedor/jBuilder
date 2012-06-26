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
            var body = jQuery.jBuilder.doLayout(jQuery.jBuilder.filter(['height','width'],obj), that.defaults);
            var bodyContainer = jQuery("<div>").html(body).css(jQuery.jBuilder.intersect(['height','width'],obj)).css({overflow : "hidden"});

            jQuery("<h3>").html(jQuery("<a>").attr("href","#").html(obj.label))
                .add(jQuery("<div>").html(bodyContainer))
                .appendTo(that.element);

            jQuery(document).bind("afterRender",function() {
                that.element.accordion("activate",index);
                if (bodyContainer.height() < body.height()) {
                    jQuery("<div>").css({position:"absolute", top : 20, right : 4, height: "85%"}).slider({
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
                    }).appendTo(bodyContainer);
                }
                if (index == that.items.length - 1) {
                    that.element.accordion("activate", 0);
                    that.element.accordion({animated : true});
                }
            });
        });

        this.element.accordion({autoHeight: false,animated : false});

        return this.element;
    }
});