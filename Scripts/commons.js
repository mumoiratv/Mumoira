let API_URL = $("#api_url").val();

function dateConvertToString(date) {
    if (date == null) return null;
    date = new Date(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd + 'T00:00:00';
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Func get query string
let getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


$(function () {
    toastr.options = {
        "positionClass": "toast-bottom-right"
    }
})

function showLoading(message = "Đang tải dữ liệu") {
    $(".fakeLoader .text-loading").html(message);
    $(".fakeLoader").fadeIn();
}

function hideLoading() {
    let message = "Đang tải dữ liệu";
    $(".fakeLoader .text-loading").html(message);
    $(".fakeLoader").fadeOut();
}