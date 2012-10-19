(function($){

"use strict";

$.jB.extend("form.field.label", {
    alias : "label",

    attributes : [],

    init : function() {
        if (this.width !== undefined) {
            delete this.width;
        }
    },

    doLayout : function() {
        this.element = $("<div>").addClass("fieldLabel");

        if (this.anchor !== undefined) {
            this.width = this.anchor;
        }

        if (this.noLabel === undefined || !this.noLabel) {
            this.element.html(this.label);
        }

        this.buildStyleAttr();

        return this.element;
    }
});
})(jQuery);