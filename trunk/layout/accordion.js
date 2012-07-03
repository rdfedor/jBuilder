(function($){
$.jB.extend("layout.accordion", {
    layout : "accordion",

    attributes : ["id", "class", "method", "name", "action"],

    events : {
        onRender : function(e) {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            var tabs = cmp.element.children("div");
            $.each(tabs,function(index,value) {
                cmp.element.accordion("activate",index);
                $.jB.util.scrollBar($(value),{rightOffset : 3, heightOffset : 10,topOffset : 20});
            });
            cmp.element.accordion("activate",0);
            cmp.element.accordion({animated : true});
            e.stopPropagation();
        }
    },

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
            var body = $.jB.doLayout($.jB.util.filter(['height','width'],obj), that.defaults);
            var bodyContainer = $("<div>").addClass("jBContent").html(body).css($.jB.util.intersect(['height','width'],obj)).css({overflow : "hidden"});

            $("<h3>").html($("<a>").attr("href","#").html(obj.label))
                .add($("<div>").html(bodyContainer))
                .appendTo(that.element);
        });

        this.element.accordion({autoHeight: false,animated : false});

        return this.element;
    }
});
})(jQuery);