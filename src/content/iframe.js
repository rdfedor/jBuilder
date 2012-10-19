(function($){
    $.jB.extend("content.iframe", {
        alias : "iframe",

        attributes : ["id","class", "style","src"],

        'class' : "",

        events : {
            onResize : function(e) {
                var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
                cmp.buildStyleAttr();

                e.stopPropagation();
            }
        },

        doLayout : function() {
            var that = this;

            this.element = $("<iframe>");

            if (this.url !== undefined) {
                this.src = this.url;
            }

            this.buildElementAttr().buildStyleAttr().buildClassAttr();

            return this.element;
        }
    });
})(jQuery);