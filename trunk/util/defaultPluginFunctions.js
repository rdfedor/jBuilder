jQuery.extend(jQuery.jBuilder, {
    defaultPluginFunctions : {

        buildClassAttr : function() {
            var ret = [];
            ret.push(this.eleID);
            if (this.alias !== undefined) {
                ret.push("jB" + this.alias);
            }
            ret.push(this.class);
            return ret.join(" ");
        },
        buildStyleAttr : function(obj) {
            if (obj === undefined) {
                obj = this;
            }

            function formatValue(val) {
                if (val.constructor == String) {
                    return val;
                } else if (val.constructor == Number) {
                    return val + "px"
                }
            }

            var ret = [];
            if (obj.width !== undefined) {
                ret.push("width : " + formatValue(obj.width));
            }

            if (obj.padding !== undefined && obj.padding.constructor !== Object) {
                ret.push("padding : " + formatValue(obj.padding));
            }else if (obj.padding !== undefined && obj.padding.constructor == Object) {
                if (obj.padding.left !== undefined) {
                    ret.push("padding-left : " + formatValue(obj.padding.left));
                }
                if (obj.padding.right !== undefined) {
                    ret.push("padding-right : " + formatValue(obj.padding.right));
                }
                if (obj.padding.top !== undefined) {
                    ret.push("padding-top : " + formatValue(obj.padding.top));
                }
                if (obj.padding.bottom !== undefined) {
                    ret.push("padding-bottom : " + formatValue(obj.padding.bottom));
                }
            }

            if (obj.margin !== undefined && obj.margin.constructor !== Object) {
                ret.push("margin : " + formatValue(obj.margin));
            } else if (obj.margin !== undefined && obj.margin.constructor == Object) {
                if (obj.margin.left !== undefined) {
                    ret.push("margin-left : " + formatValue(obj.margin.left));
                }
                if (obj.margin.right !== undefined) {
                    ret.push("margin-right : " + formatValue(obj.margin.right));
                }
                if (obj.margin.top !== undefined) {
                    ret.push("margin-top : " + formatValue(obj.margin.top));
                }
                if (obj.margin.bottom !== undefined) {
                    ret.push("margin-bottom : " + formatValue(obj.margin.bottom));
                }
            }


            if (obj.height !== undefined) {
                ret.push("height : " + formatValue(obj.height));
            }
            if (obj.style !== undefined) {
                ret.push(obj.style);
            }

            if (ret.length == 0)
                return null;

            return ret.join(";");
        },
        buildElementAttr : function(attributes,obj) {
            var ret = [];

            jQuery.each(attributes, function(key, attr){
                if (obj[attr] != null) {
                    if (obj[attr].constructor == Boolean && obj[attr]) {
                        ret.push(attr);
                    } else {
                        ret.push(attr + "=\"" + obj[attr] + "\"");
                    }
                }
            });
            return ret.join(" ");
        },
        destroy : function() {
            jQuery("." + this.eleID).remove();
            delete jQuery.jBuilder.elements[this.eleID];
        }
    }
});