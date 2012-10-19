(function($) {
    
"use strict";

$.jB.extend("form.field.datefield", {
    extend : "form.field.textfield",
    alias : "datefield",

    events : {
        onRender : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            $(this).find("input").datepicker($.jB.util.intersect(['dateFormat','buttonImage','buttonImageOnly','showOn','buttonText','showAnim','minDate','maxDate','showButtonPanel'],cmp));
        }
    }
});

})(jQuery);