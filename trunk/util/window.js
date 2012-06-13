jQuery.jBuilder.extend("util.window",{
    tpl : "<div #attr#>#body#</div>",

    attributes : ['id','title', 'class'],
    events : {
        afterRender : function(e) {
            e.el.show();
        }
    },

    show : function() {
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
        jQuery("#" + this.eleID).dialog(cfg);
    },

    doLayout : function() {
        jQuery(document).bind("afterRender", function(e){
            e.el = that;
            return that.events.afterRender(e);
        });

        this.id = this.eleID;
        var attr = this.buildElementAttr(this.attributes,this);
        var body = jQuery.jBuilder.doLayout(this.items);
        var that = this;

        return this.tpl.replace("#attr#", attr).replace("#body#",body);
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