jQuery.jBuilder.extend("form.field.textfield", {
    alias : "textfield",

    inputType : "textfield",

    attributes : ["id","class"],
    inputAttributes : ['type','name', 'value', 'disabled', 'title', 'tabindex'],

    class : "",

    doLayout : function() {
        var label = new jQuery.jBuilder.form.field.label(this.cfg);

        this.type = this.inputType;

        var inputField = jQuery("<input>").attr(jQuery.jBuilder.intersect(this.inputAttributes,this));

        this.buildStyleAttr(null,inputField);

        this.element = jQuery("<div>").append(label.doLayout()).append(inputField);

        this.buildElementAttr().buildClassAttr();

        return this.element;
    }
});