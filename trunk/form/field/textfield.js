(function($){
$.jB.extend("form.field.textfield", {
    alias : "textfield",

    inputType : "textfield",

    attributes : ["id","class"],
    inputAttributes : ['type','name', 'value', 'disabled', 'title', 'tabindex'],

    class : "",

    events : {
        keyup : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            $.jB.util.validator.validate(cmp);
        }
    },

    doLayout : function() {
        var label = new $.jB.form.field.label(this.cfg);

        this.type = this.inputType;

        var inputField = $("<input>").attr($.jB.util.intersect(this.inputAttributes,this)).css({
            borderWidth : 1,
            borderStyle : "solid"
        }).addClass("ui-corner-all");

        this.buildStyleAttr(null,inputField);

        this.element = $("<div>").append(label.doLayout()).append(inputField);

        this.buildElementAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);