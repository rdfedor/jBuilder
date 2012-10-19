(function($){

"use strict";
$.jB.extend("form.field.button", {
    alias : "button",

    attributes : ["id","class"],

    'class' : "",

    doLayout : function() {
        var that = this;

        this.type = this.inputType;

        this.element = $("<div>").html("&nbsp;");

        if (this.items === undefined) {
            this.items = [{
                text : this.text,
                handler : this.handler
            }];
        }

        $.each(this.items, function(index,obj){
            obj.id = $.jB.util.generateUID();
            var button = $("<button>").text(obj.text).attr("id",obj.id).button().click(obj.handler);
            that.element.append(button);
        });

        this.element.append($("<div>").addClass("clrLeft").html("&nbsp;"));

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});

})(jQuery);