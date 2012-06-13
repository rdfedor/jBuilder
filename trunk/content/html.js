jQuery.jBuilder.extend("content.html", {
    alias : "html",

    tpl : "<div #attr#>#text#</div>",

    attributes : ["id","class", "style"],

    class : "",

    doLayout : function() {
        var text = "",
            that = this;

        this.style = this.buildStyleAttr();

        if (this.text !== undefined) {
            text = this.text;
        }
        if (this.url !== undefined) {
            jQuery.get(this.url, function(data) {
                jQuery("div." + that.eleID).html(data);
            });
        }

        return this.tpl.replace("#attr#",this.buildElementAttr(this.attributes,this))
            .replace("#text#",text);
    }
});