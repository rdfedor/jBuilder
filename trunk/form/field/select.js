jQuery.jBuilder.extend("form.field.select", {
    alias : "select",

    tpl : "<div #attr#>#label#<select #inputAttr#>#options#</select></div>",

    attributes : ["id","class"],
    inputAttributes : ['name', 'multiple', 'size', 'disabled', 'title', 'tabindex'],
    selectAttributes : ['label','value','disabled','selected'],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Dropdown has no elements");
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
            .replace("#inputAttr#", this.buildElementAttr(this.inputAttributes,this))
            .replace("#options#", this.processOptions());
    },

    processOptions : function() {
        var opts = [],
            that = this;

        jQuery.each(this.items, function(index,opt) {
            opts.push("<option " + that.buildElementAttr(that.selectAttributes,opt) + ">" + opt.label + "</option>");
        });

        return opts.join("");
    }
});