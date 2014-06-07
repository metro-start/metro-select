(function($){
    $.fn.metroSelect = function(options) {
        var settings = $.extend( {
            'peeking'           : '2',
            'active-class'      : 'sel-active',
            'onchange'          : function(){}
        }, options);

        var select = this;
        var uniq = this.attr("id") + "-";
        var sel = $("<div id='" + uniq + "selector'></div>");
        sel.attr("class", select.attr("class"));
        select.parent().append(sel);

        select.hide();
        var max_width = 0;
        select.children().each(function(key, val) {
			var opt = $("<span class='sel-opt " + uniq + "sel " + $(val).prop('class') + "' id='" + uniq + "sel-" + key + "'>" + val.text + "</span>");
            sel.append(opt);
        });

        $('.' + uniq + 'sel').click(function () {
            var oldVal = select.attr('selectedIndex');
            var newVal = $(this).attr('id').replace(uniq + 'sel-', '');
            if (oldVal !== newVal) {
                select.attr('selectedIndex', newVal);
                $('.' + uniq + 'sel').removeClass(settings['active-class']);
    			$(this).addClass(settings['active-class']);
                settings.onchange($(this).text());
            }
        });

        //set the default visibilities
		var elem = $("#" + uniq + "sel-" + select.attr('selectedIndex'));
		elem.addClass(settings['active-class']);

        jss.set('.inner-selector', {
            'display': 'inline-block',
            'white-space': 'nowrap',
        });
        jss.set('.sel-opt', {
            'cursor': 'pointer',
            'opacity': '0.5',
            'margin-right': '3%',
            '-webkit-transition': 'opacity .25s linear',
            'display': 'inline',
        });
        jss.set('.' + settings['active-class'], {
            'opacity': '1',
            '-webkit-transition': 'opacity .25s linear'
        });
    };
})(jQuery);
