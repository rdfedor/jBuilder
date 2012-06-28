(function($){
$.jB.extend("layout.tab", {
    layout : "tab",

    ref : {
        header : "ul li"
    },

    attributes : ["id", "class"],

    events : {
        onRender : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            var tabs = cmp.element.children("div");
            $.each(tabs,function(index,value) {
                cmp.element.tabs("select",index);
                $.jB.util.scrollBar($(value),{rightOffset : 3, heightOffset : 0,topOffset : 20});
            });
            cmp.element.tabs("select",0);
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

        var tabHeader = $("<ul>");
        var tabBody = $("");

        $.each(this.items,function(index,obj) {
            var body = $.jB.doLayout($.jB.util.filter(['height', 'width'],obj), this.defaults);
            var tabID = body.attr("class").match(/jB[\d]{4}/)[0];

            $("<li>").append($("<a>").attr("href", "#" + tabID).html(obj.label)).appendTo(tabHeader);

            var bodyContainer = $("<div>").addClass("jBContent").append(body).css($.jB.util.intersect(['height', 'width'],obj))
                .css("overflow","hidden");
            tabBody = tabBody.add($("<div>").html(bodyContainer).attr("id", tabID));
        });

        this.element.append(tabHeader).append(tabBody).tabs();

        return this.element;
    }
});
})(jQuery);