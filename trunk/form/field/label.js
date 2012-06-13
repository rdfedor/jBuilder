jQuery.jBuilder.extend("form.field.label", {
    alias : "label",

    tpl : "<div class=\"fieldLabel\" #attr#>#label#</div>",

    attributes : [],

    init : function() {
        if (this.width !== undefined) {
            delete this.width;
        }
    },

    doLayout : function() {
        if (this.anchor !== undefined) {
            this.width = this.anchor;
        }
        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        if (this.noLabel !== undefined && this.noLabel) {
            this.label = "";
        }

        return this.tpl
                .replace("#attr#", this.buildElementAttr(this.attributes,this))
                .replace("#label#", this.label);
    }
});