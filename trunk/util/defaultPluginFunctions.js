jQuery.extend(jQuery.jBuilder, {
    defaultPluginFunctions : {

        element : null,

        buildClassAttr : function() {
            this.element.addClass(this.eleID);
            if (this.alias !== undefined) {
                this.element.addClass("jB" + this.alias)
            }

            return this;
        },
        buildStyleAttr : function(obj, onObject) {
            if (obj === undefined || obj == null) {
                obj = this;
            }

            if (onObject === undefined || onObject == null) {
                onObject = this.element;
            }

            function formatValue(val) {
                if (val.constructor == String) {
                    return val;
                } else if (val.constructor == Number) {
                    return val + "px"
                }
            }

            var css = {};
            if (obj.width !== undefined) {
                css.width = formatValue(obj.width);
            }

            if (obj.padding !== undefined && obj.padding.constructor !== Object) {
                css.padding = formatValue(obj.padding);
            }else if (obj.padding !== undefined && obj.padding.constructor == Object) {
                if (obj.padding.left !== undefined) {
                    css['padding-left'] = formatValue(obj.padding.left);
                }
                if (obj.padding.right !== undefined) {
                    css['padding-right'] = formatValue(obj.padding.right);
                }
                if (obj.padding.top !== undefined) {
                    css['padding-top'] = formatValue(obj.padding.top);
                }
                if (obj.padding.bottom !== undefined) {
                    css['padding-bottom'] = formatValue(obj.padding.bottom);
                }
            }

            if (obj.margin !== undefined && obj.margin.constructor !== Object) {
                css.margin = formatValue(obj.margin);
            } else if (obj.margin !== undefined && obj.margin.constructor == Object) {
                if (obj.margin.left !== undefined) {
                    css["margin-left"] = formatValue(obj.margin.left);
                }
                if (obj.margin.right !== undefined) {
                    css["margin-right"] = formatValue(obj.margin.right);
                }
                if (obj.margin.top !== undefined) {
                    css.top = formatValue(obj.margin.top);
                }
                if (obj.margin.bottom !== undefined) {
                    css.bottom = formatValue(obj.margin.bottom);
                }
            }


            if (obj.height !== undefined) {
                css.height = formatValue(obj.height);
            }
            if (obj.style !== undefined) {
                var that = this;
                jQuery(obj.style, function(index,value) {
                    css[index] = formatValue(value);
                });
            }
            onObject.css(css);

            return this;
        },
        buildElementAttr : function(attributes,obj) {
            var that = this;

            if (obj == null) {
                obj = this;
            }

            if (attributes == null) {
                attributes = this.attributes;
            }

            this.element.attr(jQuery.jBuilder.intersect(attributes,obj));

            return this;
        },
        destroy : function() {
            jQuery("." + this.eleID).remove();
            delete jQuery.jBuilder.elements[this.eleID];
        }
    }
});