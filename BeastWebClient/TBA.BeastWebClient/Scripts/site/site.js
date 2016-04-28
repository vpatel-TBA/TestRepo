
$(function () {
    $(":button").click(function (e) {

        if ($(this).hasClass('btn') && $(this).hasClass('action')) {
            var form = $(this).parents('form:first');
            var beforeSubmitFunction = window[$(this).attr("data-beforeSubmitFunction")];
            if (beforeSubmitFunction) {
                var searchValue = beforeSubmitFunction($(this));
                if (searchValue) {
                    $("#action", form).val(this.name);
                    $(form).submit();
                    return false;
                }
                else {
                    return false;
                }
            }
            else {



                $("#action", form).val(this.name);
                $(form).submit();
                return false;
            }
        }

        if ($(this).hasClass('btn') && $(this).hasClass('cancel')) {
            location.href = $(this).attr('href');
            return false;
        }
    });

});


$(window).resize(function () { windowcheck(); });
$(window).load(function () { windowcheck(); });


function windowcheck() {
    if ($(window).width() > 1280) {
        var minheight1 = $(window).height() - 65; $(".main-content").css("min-height", minheight1); $(".sidebar").css("min-height", minheight1);
    }
    else {
        $(".main-content, .sidebar").css("min-height", "inherit");
    }
}

$(".userpanetogglelinke").click(function () {
    
    $(".userpanetoggle").slideToggle(100);
    $(".navtoppanel .fa-angle-up").addClass("fa-angle-down");
    return false;
});



$(".advancesearchpanel").click(function () {
    $(".advancesearchtoggle").toggle();
    return false;
});



;(function ($, window, document, undefined) {

    var pluginName = "metisMenu",
        defaults = {
            toggle: true
        };
        
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var $this = $(this.element),
                $toggle = this.settings.toggle;

            $this.find('li.active').has('ul').children('ul').addClass('collapse in');
            $this.find('li').not('.active').has('ul').children('ul').addClass('collapse');

            $this.find('li').has('ul').children('a').on('click', function (e) {
                e.preventDefault();

                $(this).parent('li').toggleClass('active').children('ul').collapse('toggle');

                if ($toggle) {
                    $(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');
                }
            });
        }
    };

    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);


$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
$(function() {
    $(window).bind("load resize", function() {
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
		
		
    })
})

//popup
$('.open-popup-link').magnificPopup({
  type:'inline',
  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
});
//popup end

//Draggable box 
(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({ handle: "#formatBoxTitle", cursor: "move" }, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);

$('div#test-popup').drags();
