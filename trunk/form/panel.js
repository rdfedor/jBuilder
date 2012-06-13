jQuery.jBuilder.extend("form.panel", {
    alias : "form",

    tpl : "<form #attr#>#body#</form>",

    attributes : ["id", "class", "method", "name", "action"],
    
    init : function() {
    	if (this.items === undefined) {
            throw new Error("Form has no elements");
        }
    },
    
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }
        var html = this.tpl;

        this.class = this.buildClassAttr();

        var style = this.buildStyleAttr();
        if (style !== null) {
            this.style = style;
            this.attributes.push("style");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }

        return html.replace("#attr#", this.buildElementAttr(this.attributes,this))
                   .replace("#body#", jQuery.jBuilder.doLayout(this.items, this.defaults));
    }
});