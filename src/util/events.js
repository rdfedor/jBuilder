(function($){
    $.jB.namespace("$.jB.util.events");
    $.extend($.jB.util.events,{
        findElementsByTrigger : function(name, obj) {
            if (obj === undefined) {
                obj = document;
            }

            var el = [];
            $.each($(obj).find("*"), function(index,value){
                var data = $._data(value,"events");
                if (data !== undefined && data[name] !== undefined) {
                    el.push(value);
                }
            });

            return el;
        },

        triggerChildEvents : function(name,obj) {
            //obj.children().find("*").trigger(name);
            $.each(this.findElementsByTrigger(name,obj),function(index,value) {
                $(this).trigger(name);
            });
        }
    });

})(jQuery);