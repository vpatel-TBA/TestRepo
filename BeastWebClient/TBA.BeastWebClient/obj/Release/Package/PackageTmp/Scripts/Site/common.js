$(document).ready(function () {
    
    /*----------------------------------------------------*/
    /*	Back Top Link
	/*----------------------------------------------------*/
    var offset = 200;
    var duration = 500;
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) {
            $('.backTop').fadeIn(400);
        } else {
            $('.backTop').fadeOut(400);
        }
    });
    $('.backTop').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    })


    /*----------------------------------------------------*/
    /*	Home Banner
	/*----------------------------------------------------*/
    $('.main-banner').carousel({
        navigation: true,
        pagination: false,
        slideSpeed:5000,
        //stopOnHover: false,
        autoPlay:500,
        singleItem: true,
        autoHeight: true
    })
	
	
	/*----------------------------------------------------*/
    /*	Service Box
	/*----------------------------------------------------*/
$("#box1").on("mouseenter",this, function () {
		$("#boxMainTxt3").hide();
		$("#boxMainTxt2").hide();
		$("#boxMainTxt1").slideDown('fast');
	});
	$("#box1").on("mouseleave",this, function () {
		$("#boxMainTxt3").hide();
		$("#boxMainTxt2").hide();
		$("#boxMainTxt1").slideUp('fast');
	});
$("#box2").on("mouseenter",this, function () {
		$("#boxMainTxt1").hide();
		$("#boxMainTxt3").hide();
		$("#boxMainTxt2").slideDown('fast');
	});
	$("#box2").on("mouseleave",this, function () {
		$("#boxMainTxt1").hide();
		$("#boxMainTxt3").hide();
		$("#boxMainTxt2").slideUp('fast');
	});
	
	$("#box3").on("mouseenter",this, function () {
		$("#boxMainTxt1").hide();
		$("#boxMainTxt2").hide();
		$("#boxMainTxt3").slideDown('fast');
	});
	$("#box3").on("mouseleave",this, function () {
		$("#boxMainTxt1").hide();
		$("#boxMainTxt2").hide();
		$("#boxMainTxt3").slideUp('fast');
	});
	/*----------------------------------------------------*/
    /*	Login Secation
	/*----------------------------------------------------*/
	$(".forgot").click(function(){
        $(".passwordMain").hide(1000);
		$("#logintext").text("Forgot Password");
		$(".forgot").hide();
		$(".login").show();
		$(".signIn").val("Submit");
    }); 
	
	$(".login").click(function(){
        $(".passwordMain").show(1000);
		$("#logintext").text("Login");
		$(".forgot").show();
		$(".login").hide();
		$(".signIn").val("Sign In");
    }); 

	
	/*----------------------------------------------------*/
    /*	Idea Factory Accordion Secation
	/*----------------------------------------------------*/
	
	function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
	}
	$('#idea-factory-accordion').on('hidden.bs.collapse', toggleChevron);
	$('#idea-factory-accordion').on('shown.bs.collapse', toggleChevron);


	/*----------------------------------------------------*/
    /*	Navigation Scroll
	/*----------------------------------------------------*/
	
	 $(".scroll").click(function(event){
         event.preventDefault();
         //calculate destination place
         var dest=0;
         if($(this.hash).offset().top > $(document).height()-$(window).height()){
              dest=$(document).height()-$(window).height();
         }else{
              dest=$(this.hash).offset().top;
         }
         //go to destination
         $('html,body').animate({scrollTop:dest}, 1000,'swing');
     });
	 
	 //$('.navbar-nav').on('click', 'li', function(){
    	//$('.navbar-nav li').removeClass('active');
    	//$(this).addClass('active');
		
	 //});
	
	 /*----------------------------------------------------*/
    /*	Home Banner
	/*----------------------------------------------------*/
    //$('#ourClientLogo').carousel({
    //    interval: 4000
    //});
	
	$('.logocarousel').carousel({
        navigation: true,
        pagination: false,
        slideSpeed:5000,
        //stopOnHover: false,
        autoPlay:500,
        singleItem: true,
        autoHeight: true
    })
	
	
	 var owl = $('.owl-carousel');
	 owl.owlCarousel({
       // slideBy: 4,
        loop: true,
		items:4,
        margin:10,
        //nav: true,
        //dots: false,
        //navText: ['', ''],
        autoplay:true,
		responsiveClass:true,
		responsive:true,
		autoplay:true,
        autoplayTimeout:1000,
        autoplayHoverPause:true,
        responsive: {
            0: {
                items: 1
            },

            480: {
                items: 2
            },

            600: {
                items: 3
            },

            1000: {
                items: 4
            }
        }
    })
	
	 //$('#findevr').modal({
//        backdrop: 'static'
//    })
	

});





/* ----------------- End JS Document ----------------- */



