jQuery.jBuilder.extend("form.panel", {
    alias : "form",

    attributes : ["id", "class", "method", "name", "action"],
    
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }
        if (this.defaults === undefined) {
            this.defaults = {};
        }

        this.element = jQuery("<form>").append(jQuery.jBuilder.doLayout(this.items, this.defaults));

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});