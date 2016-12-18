// This function is called immediately. The second function is passed in
// as the factory parameter to this function.
(function (factory) {
  // If there is a variable named module and it has an exports property,
  // then we're working in a Node-like environment. Use require to load
  // the jQuery object that the module system is using and pass it in.
  if(typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"), require("jss"), window, document);
  }
  // Otherwise, we're working in a browser, so just pass in the global
  // jQuery object.
  else {
    factory(jQuery, jss, window, document);
  }
}(function($, jss, window, document, undefined) {
  // This code will receive whatever jQuery object was passed in from
  // the function above and will attach the plugin to it.

  var defaults = {
    initial           : '',
    peeking           : 2,
    active_class      : 'metroselect-active',
    option_class      : 'metroselect-option',
    container_class   : 'metroselect-container',
    onchange          : function(){}
  };

  function MetroSelect(select, options) {
        this.select = select;
        this.settings = $.extend({}, defaults, options);
        this.metroSelect = $("<div class='" + this.settings.container_class + "'></div>");
    }

    MetroSelect.prototype.init = function() {
        this.select.parent().append(this.metroSelect);
        this.select.hide();

        var children = this.select.children();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childElement = $("<span class='" + this.settings.option_class + "'>" + child.text + "</span>");
            console.log("binding " + child.text + " to " + this.settings.initial);
            childElement.click(this.select_child.bind(this, child.text));

            this.metroSelect.append(childElement);
        }

        jss.set('.' + this.settings.option_class, {
            'display': 'inline',
            'cursor': 'pointer',
            'opacity': '0.5',
            'margin-right': '3%',
            '-webkit-transition': 'opacity .25s linear',
        });
        jss.set('.' + this.settings.active_class, {
            'opacity': '1',
            '-webkit-transition': 'opacity .25s linear'
        });

        //set the default visibilities
        this.select_child(this.settings.initial);
    };

    MetroSelect.prototype.select_child = function(childText) {
        var selectedChild = this.metroSelect.find(":contains('" + childText + "')");
        if (selectedChild.length === 0) {
            selectedChild = this.metroSelect.find(">:first-child");
        }

        var child = $(selectedChild);
        child.siblings().removeClass(this.settings.active_class);
        child.addClass(this.settings.active_class);
        this.settings.onchange(child.text());
    };

    $.fn.metroSelect = function(options) {
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