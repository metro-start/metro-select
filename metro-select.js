// This function is called immediately. The second function is passed in
// as the factory parameter to this function.
(function (factory) {
    // If there is a variable named module and it has an exports property,
    // then we're working in a Node-like environment. Use require to load
    // the jQuery object that the module system is using and pass it in.
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(require("jquery"), require("jss"), window, document);
    }
    // Otherwise, we're working in a browser, so just pass in the global
    // jQuery object.
    else {
        factory(jQuery, jss, window, document);
    }
}(function ($, jss, window, document, undefined) {
    // This code will receive whatever jQuery object was passed in from
    // the function above and will attach the plugin to it.
    var first = true;
    var defaults = {
        initial: '',
        margins: '8px',
        added_class: '',
        removed_class: '',
        add_text: '[+]',
        remove_text: '[x]',
        adder_remover_class: '',
        active_class: 'metroselect-active',
        option_class: 'metroselect-option',
        container_class: 'metroselect-container',
        guide_class: 'metroselect-guide',
        guide_text_left: '[',
        guide_text_right: ']',
        onchange: function () {},
        onvisibilitychange: function() { return true; }
    };

    function MetroSelect(select, options) {
        this.select = select;
        this.settings = $.extend({}, defaults, options);
        this.metroSelect = $("<div class='" + this.settings.container_class + "'></div>");
        this.childContainer = $("<span></span>");
    }

    // Initialize and replace DOM elements.
    MetroSelect.prototype.init = function () {
        this.select.parent().append(this.metroSelect);
        this.select.hide();

        this.childContainer = $("<span></span>");
        var children = this.select.children();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childElement = $(`<span class='${this.settings.option_class} ${child.className}' ${child.style.cssText !== '' ? `style='${child.style.cssText}'` : ''}>${child.text}</span>`);
            childElement.click(this.select_child.bind(this, child.text));

            if (child.className.includes('removeable')) {
                var addElement = $(`<span class='${this.settings.adder_remover_class}'>${this.settings.add_text}</span>`);
                var removeElement = $(`<span class='${this.settings.adder_remover_class}'>${this.settings.remove_text}</span>`);
                addElement.click(this.add_child.bind(this, child.text, addElement, removeElement));
                removeElement.click(this.remove_child.bind(this, child.text, addElement, removeElement));

                if (child.className.includes('removed')) {
                    removeElement.css('display', 'none'); 
                } else {
                    addElement.css('display', 'none');
                }
                childElement.append(addElement);
                childElement.append(removeElement);
            }

            this.childContainer.append(childElement);
        }

        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_left + "</span>"));
        this.metroSelect.append(this.childContainer);
        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_right + "</span>"));

        jss.set('.' + this.settings.option_class, {
            'display': 'inline-block',
            'cursor': 'pointer',
            'opacity': '0.5',
            'margin-left': this.settings.margins,
            'margin-right': this.settings.margins,
            'transition': 'opacity .25s linear',
            '-webkit-transition': 'opacity .25s linear'
        });
        jss.set('.' + this.settings.active_class, {
            'opacity': '1',
            'transition': 'opacity .25s linear',
            '-webkit-transition': 'opacity .25s linear'
        });
        jss.set('.' + this.settings.guide_class + ':first-child', {
            'margin-right': this.settings.margins,
        });
        jss.set('.' + this.settings.guide_class + ':last-child', {
            'margin-left': this.settings.margins,
        });

        //set the default visibilities
        this.set_active(this.settings.initial);
    };

    // Make cihldText the active item and trigger callbacks.
    MetroSelect.prototype.select_child = function (childText) {
        this.set_active(childText);
        if (this.settings.onchange) {
            this.settings.onchange(childText);
        }
    };

    // Make cihldText the active item and trigger callbacks.
    MetroSelect.prototype.add_child = function (childText, addElem, removeElem) {
        console.log(addElem, removeElem);
        this.set_class(childText, this.settings.removed_class, this.settings.added_class);
        if (!!this.settings.onvisibilitychange) {
            this.settings.onvisibilitychange(childText, true, function(res) {
                if (res) {
                    addElem.css('display', 'none');
                    removeElem.css('display', 'initial');
                }
            });
        } else {
            addElem.css('display', 'none');
            removeElem.css('display', 'initial');    
        }
    };

    // Make cihldText the active item and trigger callbacks.
    MetroSelect.prototype.remove_child = function (childText, addElem, removeElem) {
        this.set_class(childText, this.settings.added_class, this.settings.removed_class);
        if (!!this.settings.onvisibilitychange) {
            this.settings.onvisibilitychange(childText, false, function(res) {
                if (res) {
                    addElem.css('display', 'initial');
                    removeElem.css('display', 'none');
                }
            });
        } else {
            addElem.css('display', 'initial');
            removeElem.css('display', 'none');    
        }
    };

    // Make childText the acitve item.
    MetroSelect.prototype.set_active = function (childText) {
        this.set_class(childText, this.settings.active_class, this.settings.active_class);
    };


    // Make childText the acitve item.
    MetroSelect.prototype.set_class = function (childText, oldClass, newClass) {
        var selectedChild = this.childContainer.find(":contains('" + childText + "')");
        console.log('select', this.childContainer, 'text', selectedChild);
        // selectedChild = selectedChild.filter(function () {
        //     console.log('why', $(this).text());
        //     return $(this).text() === childText;
        // });
        if (selectedChild.length === 0) {
            selectedChild = this.childContainer.find(">:first-child");
        }

        var child = $(selectedChild);
        child.siblings().removeClass(oldClass);
        child.addClass(newClass);
    };

    $.fn.metroSelect = function (options) {
        var select = $(this);

        if (!select.data('metroSelect')) {
            var metroSelect = new MetroSelect(select, options);
            select.data('metroSelect', metroSelect);
            metroSelect.init(select);

            return metroSelect;
        } else {
            return select.data('metroSelect');
        }
    };
}));