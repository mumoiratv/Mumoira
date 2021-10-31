$(function () {
    $(".file-input").on('change', function () {
        let self = this;
        showLoading("Đang tải ảnh lên !");
        var $files = $(this).get(0).files;
        if ($files.length) {

            var formData = new FormData();
            formData.append('image', $files[0]);



            setTimeout(function () {
                var apiUrl = 'https://api.imgur.com/3/image';
                var apiKey = '63240efb8580330';

                $.ajax({
                    async: false,
                    crossDomain: true,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    url: apiUrl,
                    data: formData,
                    headers: {
                        Authorization: 'Client-ID ' + apiKey,
                        Accept: 'application/json',
                    },
                    mimeType: 'multipart/form-data',
                }).done(function (response) {
                    $(self).val("");
                    var obj = JSON.parse(response);
                    $(self).closest(".file-upload-container").find(".wrap-animate").addClass("show");
                    $(self).closest(".file-upload-container").find(".file-url-output").val(obj.data.link);
                    $(self).closest(".file-upload-container").find(".avatar-view").attr("src", obj.data.link)
                    $(self).closest(".file-upload-container").find(".lightbox-preview").attr("href", obj.data.link);
                    hideLoading();

                }).fail(err => {
                    $(self).val("");
                    toastr.error("Lỗi khi tải ảnh lên! Vui lòng thử lại");
                    hideLoading();
                });

                //var settings = {
                //    async: false,
                //    crossDomain: true,
                //    processData: false,
                //    contentType: false,
                //    type: 'POST',
                //    url: apiUrl,
                //    headers: {
                //        Authorization: 'Client-ID ' + apiKey,
                //        Accept: 'application/json',
                //    },
                //    mimeType: 'multipart/form-data',
                //};
                //settings.data = formData;

                //$.ajax(settings).done(function (response) {
                //    console.log(response);
                //    var obj = JSON.parse(response);
                //    $(self).closest(".file-upload-container").find(".file-url-output").val(obj.data.link);
                //    $(self).closest(".file-upload-container").find(".avatar-view").attr("src", obj.data.link)
                //    $(self).closest(".file-upload-container").find(".lightbox-preview").attr("href", obj.data.link);
                //}).catch(err => {
                //    toastr.error("Lỗi khi tải ảnh lên! Vui lòng thử lại");

                //}).done(res => {
                //    $("#file-image").val("");
                //    hideLoading();
                //});
            }, 1000)

        }
    });
})