//Menu sidebar fix mobile
$(".menu-bar").click(function () {
    $("#pageslide").toggleClass("active")
});


$(function () {

    $(".list-vip li").click(function () {
        let elem = $(this).find(".content-sub");
      
        elem.toggleClass("active")
    })

    $(".list-post li .item-post").click(function () {
        let elem = $(this).parent("li").find(".content-sub");
        elem.toggleClass("active")
    })



    


    $("#back-to-top").click(function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 },10);
    })

    //File 
    $(".file-upload-url-remove").click(function () {
        let imageEmpty = "/Content/images/icon/no_image_full.jpg";
        var parent = $(this).closest(".file-upload-container");
        parent.find(".file-upload-control").val("");
        parent.find(".lightbox-preview").attr("href", imageEmpty)
        parent.find("[class*='file-upload-preview']").attr("src", imageEmpty);
        parent.find(".full-file-url-full").val("");
    });

    $(".file-upload-thumb-remove").click(function () {
        let imageEmpty = "/Content/images/icon/no_image_full.jpg";
        var parent = $(this).closest(".file-upload-container");
        parent.find(".file-upload-control").val("");
        parent.find(".lightbox-preview").attr("href", imageEmpty)
        parent.find("[class*='file-upload-preview']").attr("src", imageEmpty);
        parent.find(".full-file-url-full").val("");
    });

    $(".full-file-url-full").on('input', function () {
        var val = $(this).val();

        if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(val)) {
            $(this).closest(".file-upload-container").find("a.fancybox").attr("href", val).find("img").attr("src", val);
        }
        else {
            val = "/Content/images/icon/no_image_full.jpg";
            $(this).closest(".file-upload-container").find("a.fancybox").attr("href", val).find("img").attr("src", val);
        }
    });

    $(".full-file-url-full").dblclick(function () {
        $(this).removeAttr("readonly");
    });

    $(".full-file-url-full").blur(function () {
        $(this).attr("readonly", "readonly");
    });

    $('[data-fancybox="gallery"]').fancybox();

    setTimeout(function () {
        $(".alert-close").fadeOut(1000);
    }, 2000)

    $("#copy-link").click(function () {
        var url = window.location.href;
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(url).select();
        document.execCommand("copy");
        $temp.remove();
        $(this).tooltip({ boundary: 'window', title: "Copy thành công!", placement: "right" })
        $(this).tooltip('show');

        setTimeout(function () {
            $(this).tooltip('hide');
        }.bind(this), 2000)
    });
    //Scroll to content detail page
    //$('html, body').animate({
     //   scrollTop: ($("#scroll-detail").offset().top) - 60
    //}, 0);

})