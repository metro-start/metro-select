(function($){
    $.fn.metroSelect = function(options) {
        var settings = $.extend( {
            'font-size'         : '12'
        }, options);

        console.log(settings);
        this.hide();
        var sel = $("<div id='selector'><div id='inner-selector'></div></div>");
        this.parent().append(sel);
        isel = $("#inner-selector");
        var max_width = 0;
        var total_width = 0;
        this.children().each(function() {
            console.log(this);
            var opt = $("<span class='sel-opt' style='font-size: " + settings['font-size'] + "'>" + this.text + "</span>");
            isel.append(opt);
            max_width = Math.max(max_width, opt.width());
            total_width += opt.width();
            console.log(max_width);
        });
        isel.css('width', total_width);
        sel.css('height', settings['font-size']);
        sel.css('width', max_width + max_width/4);
        sel.css('overflow', 'hidden');
    };
})(jQuery);
