jQuery.jBuilder.extend("form.field.button", {
    alias : "button",

    tpl : "<div #attr#>#body#</div><div class=\"clrLeft\">&nbsp;</div>",
    innerTpl : "<button  #attr#>#text#</button>",

    attributes : ["id","class"],

    class : "",

    doLayout : function() {
        this.type = this.inputType;

        this.class = this.buildClassAttr();

        var that = this,
            buttons = [];

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        if (this.items === undefined) {
            buttons.push(this.innerTpl
                .replace("#text#",this.text)
                .replace("#attr#",""));
        } else {
            jQuery.each(this.items,function(index,obj) {
                var uid = jQuery.jBuilder.generateUID();
                obj.id = uid;
                buttons.push(that.innerTpl
                    .replace("#text#",obj.text)
                    .replace("#attr#", that.buildElementAttr(['id'],{id : uid}))
                );
            });
        }

        jQuery(document).bind("afterRender", function() {
            var button = jQuery("." + that.eleID + " button").button();
            if (that.items !== undefined) {
                jQuery.each(that.items, function(index, obj) {
                    if (obj.handler !== undefined) {
                        jQuery("button#" + obj.id).click(obj.handler);
                    }
                });
            } else if (that.handler !== undefined) {
                button.click(that.handler);
            }
        });

        return this.tpl.replace("#attr#", this.buildElementAttr(this.attributes,this))
            .replace("#body#",buttons.join(""))
            .replace("#text#", this.text);
    }
});