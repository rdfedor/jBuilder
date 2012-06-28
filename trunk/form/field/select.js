(function($){
$.jB.extend("form.field.select", {
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
        var label = new $.jB.form.field.label(this.cfg),
            that = this;

        this.element = $("<div>").append(label.doLayout());

        var selectElement = $("<select>").attr($.jB.util.intersect(this.inputAttributes,this));

        $.each(this.items,function(index,opt) {
            selectElement.append($("<option>").text(opt.label).attr($.jB.util.intersect(that.selectAttributes,opt)));
        });
        this.element.append(selectElement);

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);