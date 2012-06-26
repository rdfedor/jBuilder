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

        var form = jQuery("<form>").attr(jQuery.jBuilder.intersect(this.attributes,this)).append(jQuery.jBuilder.doLayout(this.items, this.defaults));

        this.element = jQuery("<div>").append(form);

        this.buildStyleAttr().buildClassAttr();

        return this.element;
    }
});