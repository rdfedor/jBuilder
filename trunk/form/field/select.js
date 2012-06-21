jQuery.jBuilder.extend("form.field.select", {
    alias : "select",

    attributes : ["id","class"],
    inputAttributes : ['name', 'multiple', 'size', 'disabled', 'title', 'tabindex'],
    selectAttributes : ['label','value','disabled','selected'],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Dropdown has no elements");
        }
    },

    doLayout : function() {
        var label = new jQuery.jBuilder.form.field.label(this.cfg),
            that = this;

        this.element = jQuery("<div>").append(label.doLayout());

        var selectElement = jQuery("<select>").attr(jQuery.jBuilder.intersect(this.inputAttributes,this));

        jQuery.each(this.items,function(index,opt) {
            selectElement.append(jQuery("<option>").text(opt.label).attr(jQuery.jBuilder.intersect(that.selectAttributes,opt)));
        });
        this.element.append(selectElement);

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});