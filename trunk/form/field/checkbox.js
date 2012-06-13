jQuery.jBuilder.extend("form.field.checkbox", {
    alias : "checkbox",

    tpl : "<div #attr#>#label##checkboxes#</div>",

    attributes : ["id","class"],
    inputAttributes : ['id', 'name', 'value', 'title', 'tabindex', 'disabled'],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Checkbox has no items");
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
            .replace("#checkboxes#", this.buildItems());
    },
    buildItems : function() {
        var ret = [],
            that = this;

        jQuery.each(this.items, function(index,opt) {
            if (opt.value === undefined) {
                opt.value = opt.label;
            }
            opt.id = jQuery.jBuilder.generateUID();
            ret.push("<input type=\"checkbox\" " + that.buildElementAttr(that.inputAttributes,opt) + " /><label for=\"" + opt.id + "\">"+opt.label+"</label>");
        });

        return ret.join("");
    }
});