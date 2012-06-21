jQuery.jBuilder.extend("util.window",{
    tpl : "<div #attr#>#body#</div>",

    attributes : ['id','title', 'class'],

    doLayout : function() {

        this.element = jQuery("<div>").html(jQuery.jBuilder.doLayout(this.items));
        this.buildElementAttr();

        var filter = ['width','height', 'resizable', 'buttons','modal','minWidth', 'maxWidth'],
            cfg = {},
            that = this;
        jQuery.each(filter, function(index,value) {
            if (that.cfg[value] !== undefined) {
                cfg[value] = that.cfg[value];
            }
        });
        if (cfg.width !== undefined) {
            cfg.width = cfg.width + 40;
        }
        this.element.dialog(cfg);

        return this;
    }
});

jQuery.extend(jQuery.jBuilder, {
    window : function(params) {
        var obj = new jQuery.jBuilder.util.window(params);
        jQuery("body").append(obj.doLayout());
        jQuery(document).trigger("afterRender").unbind("afterRender");
        return obj;
    }
});