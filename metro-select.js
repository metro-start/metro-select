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
        added_class: 'metroselect-added',
        removed_class: 'metroselect-removed',
        parent_added_class: 'metroselect-parent-added',
        parent_removed_class: 'metroselect-parent-removed',
        add_text: '[+]',
        remove_text: '[<span class="metroselect-remove">+</span>]',
        add_remove_class: 'add-remove',
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
            var childElement = $(`<span class='metro-select-child' ${child.style.cssText !== '' ? `style='${child.style.cssText}'` : ''}></span>`);

            var labelElement = $(`<span class='label ${this.settings.option_class} ${child.className}'>${child.text}</span>`);
            labelElement.click(this.select_child.bind(this, child.text));
            childElement.append(labelElement);

            if (child.className.includes('removeable')) {
                var addElement = $(`<span class='metroselect-addremove ${this.settings.add_remove_class}'>${this.settings.add_text}</span>`);
                var removeElement = $(`<span class='metroselect-addremove ${this.settings.add_remove_class}'>${this.settings.remove_text}</span>`);
                addElement.click(this.add_child.bind(this, child.text, addElement, removeElement));
                removeElement.click(this.remove_child.bind(this, child.text, addElement, removeElement));

                if (child.className.includes('removed')) {
                    removeElement.addClass('hide-button'); 
                    childElement.removeClass(this.settings.parent_added_class);
                    childElement.addClass(this.settings.parent_removed_class);
                } else {
                    addElement.addClass('hide-button');
                    childElement.removeClass(this.settings.parent_removed_class);
                    childElement.addClass(this.settings.parent_added_class);
                }
                childElement.append(addElement);
                childElement.append(removeElement);
            }

            this.childContainer.append(childElement);
        }

        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_left + "</span>"));
        this.metroSelect.append(this.childContainer);
        this.metroSelect.append($("<span class='" + this.settings.guide_class + "'>" + this.settings.guide_text_right + "</span>"));

        jss.set('.metro-select-child', {
            'display': 'inline-block',
            'margin-left': this.settings.margins,
            'margin-right': this.settings.margins
        });

        jss.set('.' + this.settings.option_class, {
            'cursor': 'pointer',
            'opacity': '0.5',
            'transition': 'opacity .25s linear',
            '-webkit-transition': 'opacity .25s linear'
        });

        jss.set('.metroselect-addremove', {
            'font-weight': 'bold',
            'cursor': 'pointer'
        });

        jss.set('.metroselect-remove', {
            'display': 'inline-block',
            'transform': 'rotate(45deg)'
        });

        jss.set(`.metro-select-child .label.removed`, {
            'text-decoration': 'line-through',
            'pointer-events': 'none'
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
        jss.set(`.hide-button`, {
            'display': 'none'
        });

        //set the default visibilities
        this.set_active(this.settings.initial);
    };

    // Change the selected tab.
    MetroSelect.prototype.select_child = function (childText) {
        this.set_active(childText);
        if (this.settings.onchange) {
            this.settings.onchange(childText);
        }
    };

    // The add tab button was clicked.
    MetroSelect.prototype.add_child = function (childText, addElem, removeElem) {
        this.set_class(childText, this.settings.removed_class, this.settings.added_class);
        if (!!this.settings.onvisibilitychange) {
            const that = this;
            this.settings.onvisibilitychange(childText, true, function(res) {
                if (res) { that.setAddRemoveVisibility(addElem, removeElem, true); } 
            });
        } else {
            this.setAddRemoveVisibility(addElem, removeElem, true);
        }
    };

    // The remove tab button was clicked.
    MetroSelect.prototype.remove_child = function (childText, addElem, removeElem) {
        this.set_class(childText, this.settings.added_class, this.settings.removed_class);
        if (!!this.settings.onvisibilitychange) {
            const that = this;
            this.settings.onvisibilitychange(childText, false, function(res) {
                if (res) { that.setAddRemoveVisibility(addElem, removeElem, false); }
            });
        } else {
            this.setAddRemoveVisibility(addElem, removeElem, false);
        }
    };

    // Show or hide the add/remove tab buttons.
    MetroSelect.prototype.setAddRemoveVisibility = function(addElem, removeElem, visible) {
        if (visible) {
            addElem.addClass('hide-button');        // hide add button
            removeElem.removeClass('hide-button');  // show remove button
            addElem.parent().addClass(this.settings.parent_added_class);
            addElem.parent().removeClass(this.settings.parent_removed_class);
            addElem.siblings('.label').addClass(this.settings.parent_added_class);
            addElem.siblings('.label').removeClass(this.settings.parent_removed_class);
        } else {
            addElem.removeClass('hide-button');     // show add button
            removeElem.addClass('hide-button');     // hide remove button
            addElem.parent().addClass(this.settings.parent_removed_class);
            addElem.parent().removeClass(this.settings.parent_added_class);
            addElem.siblings('.label').addClass(this.settings.parent_removed_class);
            addElem.siblings('.label').removeClass(this.settings.parent_added_class);
        }
    };

    // Change the active item.
    MetroSelect.prototype.set_active = function (childText) {
        this.set_class(childText, this.settings.active_class, this.settings.active_class);
    };

    // Set the class of the active item.
    MetroSelect.prototype.set_class = function (childText, oldClass, newClass) {
        var selectedChild = this.childContainer.find(":contains('" + childText + "')");
        if (selectedChild.length === 0) {
            selectedChild = this.childContainer.find(">:first-child");
        }

        var child = $(selectedChild);
        child.siblings().children('.label').removeClass(oldClass);
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