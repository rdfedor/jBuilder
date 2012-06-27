(function($){
$.jB.extend("form.field.checkbox", {
    alias : "checkbox",

    inputType : "checkbox",

    attributes : ["id","class"],
    inputAttributes : ['id', 'name', 'value', 'title', 'tabindex', 'disabled'],

    init : function() {
        if (this.items === undefined) {
            throw new Error(this.alias + " has no items");
        }
    },

    doLayout : function() {
        var label = new $.jB.form.field.label(this.cfg),
            that = this;

        this.element = $("<div>").append(label.doLayout());

        $.each(this.items,function(index,opt) {
            if (opt.value === undefined) {
                opt.value = opt.label;
            }

            if (opt.id === undefined) {
                opt.id = $.jB.generateUID();
            }

            var checkbox = $("<input>").attr("type",that.inputType)
                .attr($.jB.intersect(that.inputAttributes,opt))
                .add($("<label>").attr("for",opt.id).html(opt.label));

            that.element.append(checkbox);
        });

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);