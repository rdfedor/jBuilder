(function($){
$.jB.extend("content.panel", {
    alias : "panel",

    events : {
        onResize : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            cmp.element.css({
                height : cmp.height,
                width : cmp.width
            });
            var newCSS = {
                height : cmp.height - 10,
                width : cmp.width - 25
            };
            if (cmp.label !== undefined) {
                newCSS.height -= 50;
            }

            cmp.element.children(".jBContent").css(newCSS);
        },
        onRender : function(e) {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));

            if (cmp !== undefined) {
                var defaultCfg = {topOffset : 40,heightOffset : 5, marginOffset : -20};
                if (cmp.label === undefined) {
                    defaultCfg = {topOffset : 15,heightOffset : 20, marginOffset : -20};
                }
                $.jB.util.scrollBar(cmp.element,defaultCfg);
            }

            e.stopPropagation();
        }
    },
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Panel has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var content = $("<div>").addClass("jBContent").html($.jB.doLayout(this.items)).css({paddingLeft : 20, paddingRight : 20, marginTop : 10, height : this.height - 10,width : this.width - 25});
        var container = $("<div>").addClass("ui-widget-content ui-corner-all");

        if (this.label !== undefined) {
            container.append($("<div>").addClass("ui-widget-header ui-corner-all").css({padding : 5}).html(this.label));
        }

        this.element = container.append(content);
        this.buildStyleAttr().buildClassAttr();

        var cfg = $.jB.util.intersect(['height'],this);
        if (cfg.height !== undefined && this.label !== undefined) {
            cfg.height -= 60;
            this.buildStyleAttr(cfg,content);
        }

        return this.element;
    }
});
})(jQuery);