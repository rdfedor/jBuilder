(function($){
$.jB.extend("layout.accordion", {
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

        this.element = $("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (!$.isArray(this.items)) {
            this.items = [this.items];
        }

        $.each(this.items,function(index,obj) {
            var body = $.jB.doLayout($.jB.filter(['height','width'],obj), that.defaults);
            var bodyContainer = $("<div>").html(body).css($.jB.intersect(['height','width'],obj)).css({overflow : "hidden"});

            $("<h3>").html($("<a>").attr("href","#").html(obj.label))
                .add($("<div>").html(bodyContainer))
                .appendTo(that.element);
             
            $(document).bind("afterRender",function() {
                that.element.accordion("activate",index);
                if (bodyContainer.height() < body.height()) {
                    $("<div>").css({position:"absolute", top : 20, right : 4, height: "85%"}).slider({
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
})(jQuery);