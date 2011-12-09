(function($){
    $.fn.metroSelect = function(options) {
        var settings = $.extend( {
            'font-size'         : '24'
        }, options);

        var select = $("#select-box");
        console.log(settings);
        select.hide();
        var sel = $("<div id='selector'><div id='inner-selector'></div></div>");
        select.parent().append(sel);
        isel = $("#inner-selector");
        var max_width = 0;
        var total_width = 0;
        select.children().each(function(key, val) {
            var opt = $("<span class='sel-opt' id='sel-" + key + "' style='font-size: " + settings['font-size'] + "'>" + val.text + "</span>");
            isel.append(opt);
            max_width = Math.max(max_width, opt.width());
            total_width += opt.width();
        });
        
        //left side button
        $("#sel-0").click(function () {
            var select = $("#select-box");
            if(select.val() == $("#sel-0")) { //children("option:selected").index() == 0) {
                return;
            } else {
                select.val($("#sel-0").text());
                $("#sel-0").css('opacity', '1');
                $("#sel-1").css('opacity', '.1');
                $("#selector").scrollLeft(0);
            }
        });

        //right side button
        $("#sel-1").click(function () {
            var select = $("#select-box");
            if(select.val() == $("#sel-1")) { //children("option:selected").index() == 0) {
                return;
            } else {
                select.val($("#sel-1").text());
                $("#sel-1").css('opacity', '1');
                $("#sel-0").css('opacity', '.1');
                document.getElementById("selector");
                selector.scrollLeft = selector.scrollWidth - selector.clientWidth;
            }
        });

        var selected = select.children("option:selected").index();

        $(".sel-opt").css('opacity', '.1');
        $("#sel-" + selected).css('opacity', '1');

        isel.css('width', total_width);
        sel.css('height', settings['font-size']);
        sel.css('width', max_width + max_width/2);
        sel.css('overflow', 'hidden');
    };
})(jQuery);
