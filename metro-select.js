(function($){
    $.fn.metroSelect = function(options) {
        var settings = $.extend( {
            'peeking'           : '2',
            'active-class'      : 'sel-active',
            'onchange'          : function(){}
        }, options);

        var uniq = this.attr("id") + "-";
        var sel = $("<div id='" + uniq + "selector'></div>");
        var select = this;
        sel.attr("class", select.attr("class"));
        select.parent().append(sel);
        
        select.hide();
        var max_width = 0;
        select.children().each(function(key, val) {
			var opt = $("<span class='sel-opt " + uniq + "sel " + $(val).prop('class') + "' id='" + uniq + "sel-" + key + "'>" + val.text + "</span>");
            sel.append(opt);
        });

        $('.' + uniq + 'sel').click(function () {
            select.attr('selectedIndex', $(this).attr('id').replace(uniq + 'sel-', ''));
            $('.' + uniq + 'sel').removeClass(settings['active-class']);
			$(this).addClass(settings['active-class']);
            settings.onchange();
        });

        //set the default visibilities
//		console.log("#" + uniq + "sel-" + select.prop('selectedIndex'));
        //$("#" + uniq + "sel-" + select.prop('selectedIndex')).click();
		var elem = $("#" + uniq + "sel-" + select.prop('selectedIndex'));
		select.attr('selectedIndex', elem.attr('id').replace(uniq + 'sel-', ''));
		$('.' + uniq + 'sel').removeClass(settings['active-class']);
		elem.addClass(settings['active-class']);
    };
})(jQuery);
