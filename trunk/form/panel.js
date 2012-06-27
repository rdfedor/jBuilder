(function($){
$.jB.extend("form.panel", {
    alias : "form",

    attributes : ["id", "class", "method", "name", "action"],
    
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }
        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var form = $("<form>").attr($.jB.intersect(this.attributes,this)).append($.jB.doLayout(this.items, this.defaults));

        this.element = $("<div>").append(form);

        this.buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);