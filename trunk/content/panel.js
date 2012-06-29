(function($){
$.jB.extend("content.panel", {
    alias : "panel",

    events : {
        onRender : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));

            if (cmp !== undefined) {
                $.jB.util.scrollBar(cmp.element,{topOffset : 40,heightOffset : 5});
            }
        }
    },
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Panel has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var content = $("<div>").addClass("jBContent").html($.jB.doLayout(this.items)).css({paddingLeft : 20, paddingRight : 20, marginTop : 10});
        var container = $("<div>").addClass("ui-widget-content ui-corner-all");

        if (this.label !== undefined) {
            container.append($("<div>").addClass("ui-widget-header ui-corner-all").css({padding : 5}).html(this.label));
        }

        this.element = container.append(content);
        this.buildStyleAttr().buildClassAttr();

        var cfg = $.jB.util.intersect(['height'],this);
        if (cfg.height !== undefined) {
            cfg.height -= 50;
            this.buildStyleAttr(cfg,content);
        }

        return this.element;
    }
});
})(jQuery);