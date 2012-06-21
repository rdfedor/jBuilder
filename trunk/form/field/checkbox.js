jQuery.jBuilder.extend("form.field.checkbox", {
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
        var label = new jQuery.jBuilder.form.field.label(this.cfg),
            that = this;

        this.element = jQuery("<div>").append(label.doLayout());

        jQuery.each(this.items,function(index,opt) {
            if (opt.value === undefined) {
                opt.value = opt.label;
            }

            if (opt.id === undefined) {
                opt.id = jQuery.jBuilder.generateUID();
            }

            var checkbox = jQuery("<input>").attr("type",that.inputType)
                .attr(jQuery.jBuilder.intersect(that.inputAttributes,opt))
                .add(jQuery("<label>").attr("for",opt.id).html(opt.label));

            that.element.append(checkbox);
        });

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});