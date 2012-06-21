jQuery.jBuilder.extend("form.field.button", {
    alias : "button",

    attributes : ["id","class"],

    class : "",

    doLayout : function() {
        var that = this;

        this.type = this.inputType;

        this.element = jQuery("<div>").html("&nbsp;");

        if (this.items === undefined) {
            this.items = [{
                text : this.text,
                handler : this.handler
            }];
        }

        jQuery.each(this.items, function(index,obj){
            obj.id = jQuery.jBuilder.generateUID();
            var button = jQuery("<button>").text(obj.text).attr("id",obj.id).button().click(obj.handler);
            that.element.append(button);
        });

        this.element.append(jQuery("<div>").addClass("clrLeft").html("&nbsp;"));

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});