(function($) {

    (function(pluginName) {

        var subCheck = function(element){
            var form = element.parent().closest('form');
            var vCount = form.find('input[valid=true]').length;
            var count = parseInt(form.attr('count'));
            if (count <= vCount) {
                form.find('input[type=submit]').prop('disabled', false);
            }else{
                form.find('input[type=submit]').prop('disabled', true);
            }
        
        };
        var markT = function(element) {
            element.attr('valid', true);
            element.css('border', '2px solid green');
            subCheck(element);
        };
        var markF = function(element) {
            element.attr('valid', false);
            element.css('border', '2px solid red');
            subCheck(element);
        };
        var mailTest = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,4}$', 'i');
        var methods = {
            vForm: function(count) {
                this.attr('count', count);
                this.find('input[type=submit]').prop('disabled', true);
                return this;
            },
            vRexp: function(test) {
                var reg = new RegExp(test);
                var result = 0;
                this.keyup(function(e) {
                    result = reg.test(this.value);
                    if (result) {
                        markT($(this));
                    } else {
                        markF($(this));
                    }
                });
                return this;
            },
            vHint: function(hintbase, element) {
                var result = 0;
                this.keyup(function(e) {
                    var hint = hintbase[this.value];
                    result = (typeof hint === 'undefined');
                    if (result) {
                        markT($(this));
                    } else {
                        markF($(this));
                        element.val(hint);
                    }
                });
                return this;
            },
            vMail: function() {
                var result = 0;
                this.keyup(function(e) {
                    result = mailTest.test(this.value);
                    if (result) {
                        markT($(this));
                    } else {
                        markF($(this));
                    }
                });
                return this;
            },
            vPass: function(level) {
                var result = 0;
                this.keyup(function(e) {
                    var secure = 0;
                    if ((/[0-9]{1,}/).test(this.value)) {
                        secure += 1;
                    }
                    if ((/[A-Z]{1,}/).test(this.value)) {
                        secure += 1;
                    }
                    if ((/.{8,}/).test(this.value)) {
                        secure += 1;
                    }
                    result = (secure >= level);
                    if (result) {
                        markT($(this));
                    } else {
                        markF($(this));
                    }
                });
                return this;
            }
        };

        $.fn[pluginName] = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exists in jQuery.myPlugin');
            }
        };
    })('vldt');
})(jQuery);
