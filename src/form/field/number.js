(function($) {

"use strict";

$.jB.extend("form.field.number", {
    alias : "number",
    extend : "form.field.textfield",
    
    events : {
        onRender : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            $(this).find("input").spinner($.jB.util.intersect(['disabled','icons','incremental','max','min','numberFormat','page','step'],cmp));
        }
    }
});

})(jQuery);

