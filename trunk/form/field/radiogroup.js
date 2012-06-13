jQuery.jBuilder.extend("form.field.radiogroup", {
    alias : "radiogroup",

    tpl : "<div #attr#>#label##radiogroup#</div>",

    attributes : ["id","class"],
    inputAttributes : ['name', 'value', 'disabled', 'title', 'tabindex'],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Radiogroup has no items");
        }

        if (this.name === undefined) {
            throw new Error("Radiogroup requires a name")
        }
    },

    doLayout : function() {
        var label = new jQuery.jBuilder.form.field.label(this.cfg);

        this.class = this.buildClassAttr();

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        return this.tpl.replace("#attr#", this.buildElementAttr(this.attributes,this))
            .replace("#label#", label.doLayout())
            .replace("#radiogroup#", this.buildItems());
    },
    buildItems : function() {
        var ret = [],
            that = this;

        jQuery.each(this.items, function(index,opt) {
            opt.name = that.name;
            if (opt.value === undefined) {
                opt.value = opt.label;
            }
            ret.push("<input type=\"radio\" " + that.buildElementAttr(that.inputAttributes,opt) + " /> " + opt.label);
        });

        return ret.join("");
    }
});