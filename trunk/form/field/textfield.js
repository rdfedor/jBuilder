jQuery.jBuilder.extend("form.field.textfield", {
    alias : "textfield",

    inputType : "textfield",

    tpl : "<div #attr#>#label#<input #inputAttr#/></div>",

    attributes : ["id","class"],
    inputAttributes : ['type','name', 'value', 'disabled', 'title', 'tabindex'],

    class : "",

    doLayout : function() {
        var label = new jQuery.jBuilder.form.field.label(this.cfg);
        this.type = this.inputType;

        this.class = this.buildClassAttr();

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.inputAttributes.push("style");
        }

        return this.tpl.replace("#attr#", this.buildElementAttr(this.attributes,this))
        			.replace("#label#", label.doLayout())
                    .replace("#inputAttr#", this.buildElementAttr(this.inputAttributes,this));
    }
});