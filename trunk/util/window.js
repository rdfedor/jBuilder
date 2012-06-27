(function($){
$.jB.extend("util.window",{
    tpl : "<div #attr#>#body#</div>",

    attributes : ['id','title', 'class'],

    doLayout : function() {

        this.element = $("<div>").html($.jB.doLayout(this.items));
        this.buildElementAttr();

        var filter = ['width','height', 'resizable', 'buttons','modal','minWidth', 'maxWidth'],
            cfg = {},
            that = this;
        $.each(filter, function(index,value) {
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

$.extend($.jB, {
    window : function(params) {
        var obj = new $.jB.util.window(params);
        $("body").append(obj.doLayout());
        $(document).trigger("afterRender").unbind("afterRender");
        return obj;
    }
});
})(jQuery);