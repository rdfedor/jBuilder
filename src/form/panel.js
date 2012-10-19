(function($){

"use strict";
    
$.jB.extend("form.panel", {
    alias : "form",

    attributes : ["id", "class", "method", "name", "action"],

    events : {
        submit : function() {
            $(this).find("form").children("div").trigger("keyup");

            var el = $(".ui-state-error", $(this));

            if (el.length > 0) {
                var dialog = new $.jB.window({
                    title : 'Error',
                    modal : true,
                    resizeable : false,
                    buttons : {
                        OK : function() {
                            $(this).dialog("destroy");
                        }
                    },
                    items : [{
                        type : "html",
                        text : "Elements of this form failed validation."
                    }]
                });
                return false;
            }
            return true;
        }
    },
    
    init : function() {
        if (this.items === undefined || this.items.length === 0) {
            throw new Error("Form has no elements");
        }
    },
    
    doLayout : function() {
        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var form = $("<form>").attr($.jB.util.intersect(this.attributes,this)).append($.jB.doLayout(this.items, this.defaults));

        this.element = $("<div>").append(form);

        this.buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);