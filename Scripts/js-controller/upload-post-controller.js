var UploadPostController = {
    Init: function () {
        this.Register();
    },
    Register: function () {
        $("#file-image").on('change', function () {
            let self = this;

            var _URL = window.URL || window.webkitURL;
            var $files = $(this).get(0).files;
            //check dung lượng ảnh
            if (this.files[0].size / 1024 > 2333) {
                var totn_number = this.files[0].size / 1024 / 1024;

                let message = "Banner của bạn có dung lượng {0}Mb. Hãy upload banner có dung lượng < 2Mb";
                message = message.replace("{0}", totn_number.toFixed());
                toastr.warning(message);

                //Xóa dữ liệu cũ
                $(self).val("");
                return;
            }
            if ($files.length) {

                let img = new Image();
                var objectUrl = _URL.createObjectURL($files[0]);

                img.onload = function () {
                    if (this.width < 600 || this.width > 820 || this.height < 60 || this.height > 120) {
                        let message = "Vui lòng chọn size Banner có kích thước dài 780px, rộng 110px";
                        toastr.error(message);

                        //Xóa dữ liệu cũ
                        $(self).val("");
                        return;
                    }
                    else {
                        showLoading("Đang tải ảnh lên!");
                        var formData = new FormData();
                        formData.append('image', $files[0]);

                        setTimeout(function () {
                            var apiUrl = 'https://api.imgur.com/3/image';
                            var apiKey = '63240efb8580330';
                            var settings = {
                                async: false,
                                crossDomain: true,
                                processData: false,
                                contentType: false,
                                type: 'POST',
                                url: apiUrl,
                                headers: {
                                    Authorization: 'Client-ID ' + apiKey,
                                    Accept: 'application/json',
                                },
                                mimeType: 'multipart/form-data',
                            };
                            settings.data = formData;
                            $.ajax(settings).done(function (response) {
                                var obj = JSON.parse(response);
                                $(".full-file-url").val(obj.data.link);
                                $(".file-upload-preview").attr("src", obj.data.link);
                                $("#a_Avatar").attr("href", obj.data.link);
                                $(".full-file-url-full").val(obj.data.link);

                            }).catch(err => {
                                toastr.error("Lỗi khi tải ảnh lên! Vui lòng thử lại");

                            }).done(res => {
                                $("#file-image").val("");
                                hideLoading();
                            });
                        }, 1000)

                    }
                    _URL.revokeObjectURL(objectUrl);
                };
                img.src = objectUrl;
            }
        });


        $.validator.addMethod("valueNotEquals", function (value, element, arg) {
            console.log(arg !== value);
            return arg !== value;
        });
        $.validator.addMethod("http", function (value, element, arg) {
            if (value == "" || value == null) {
                return true;
            }
            return value.includes("http://") || value.includes("https://");
        });

        $.validator.addMethod("datemu", function (value, element, arg) {
            let hAlpha = $("select[name='AlphaTestTime']").val();
            let hBeta = $("select[name='OpenBetaTime']").val();
            let arr = value.split('/');

            let hh = 0;
            if (arg == "ALPHA") {
                if (hAlpha != "default") {
                    hh = hAlpha
                }
                var d1 = new Date(arr[2], arr[1], arr[0], hh, 0, 0)
                let d2Str = $("input[name='OpenBetaDateStr']").val()
                let arrD2 = d2Str.split('/');

                let h = 0
                if (hBeta != "default") {
                    h = hBeta;
                }
                var d2 = new Date(arrD2[2], arrD2[1], arrD2[0], h, 0, 0)

                var compare = UploadPostController.Methods.compare(d1, d2);
                if (compare == -1) {
                    return true;
                }
                else if (compare == 0) {
                    return true;
                }
                return false;
            }
            else if (arg == "BETA") {
                if (hBeta != "default") {
                    hh = hBeta
                }
                var d1 = new Date(arr[2], arr[1], arr[0], hh, 0, 0)
                let d2Str = $("input[name='AlphaTestDateStr']").val()
                let arrD2 = d2Str.split('/');
                let h = 0
                if (hAlpha != "default") {
                    h = hAlpha;
                }
                var d2 = new Date(arrD2[2], arrD2[1], arrD2[0], h, 0, 0)
                var compare = UploadPostController.Methods.compare(d1, d2);
                if (compare == 1) {
                    return true;
                }
                else if (compare == 0) {
                    return true;
                }
                return false;
            }
            return true;
        });
        $.validator.addMethod("tinymce", function (value, element, arg) {
            var content = tinyMCE.get('textarea_Content').getContent();
            if (content == "" || content == null) {
                return false;
            }
            else {
                return true;
            }
        });
        this.Methods.validatePost();
    },
    Methods: {
        validatePost: function () {
            let self = this;

            $("#form-mu").validate({
                rules: {
                    Title: {
                        required: true
                    },
                    Avatar: {
                        required: true
                    },
                    HomeUrl: {
                        required: true,
                        http: true
                    },
                    FanpageUrl: {
                        required: false,
                        http: true
                    },
                    NameServer: {
                        required: true
                    },
                    Description: {
                        required: true
                    },
                    MuExp: {
                        required: true
                    },
                    MuDrop: {
                        required: true
                    },
                    Description: {
                        required: true,
                        maxlength: 35
                    },
                    Content: {
                        tinymce: true,
                    },
                    MuVersionId: {
                        valueNotEquals: "default"
                    },
                    MuResetTypeId: {
                        valueNotEquals: "default"
                    },
                    MuTypeId: {
                        valueNotEquals: "default"
                    },
                    MuPointId: {
                        valueNotEquals: "default"
                    },
                    OpenBetaTime: {
                        valueNotEquals: "default"
                    },
                    AlphaTestTime: {
                        valueNotEquals: "default"
                    },
                    AlphaTestDateStr: {
                        required: true,
                        datemu: "ALPHA"
                    },
                    OpenBetaDateStr: {
                        required: true,
                        datemu: "BETA"
                    }
                },
                messages: {
                    Title: {
                        required: "Không để trống"
                    },
                    Avatar: {
                        required: "Không để trống"
                    },
                    HomeUrl: {
                        required: "Không để trống",
                        http: "Không đúng định dạng đường dẫn"
                    },
                    FanpageUrl: {
                        http: "Không đúng định dạng đường dẫn"
                    },
                    NameServer: {
                        required: "Không để trống"
                    },
                    Description: {
                        required: "Không để trống"
                    },
                    MuExp: {
                        required: "Không để trống",
                        number: "Chỉ nhập số"
                    },
                    MuDrop: {
                        required: "Không để trống",
                        number: "Chỉ nhập số"
                    },
                    Description: {
                        required: "Không để trống",
                        maxlength: "Miêu tả nội dung không được vượt quá 35 ký tự"
                    },
                    Content: {
                        tinymce: "Không để trống",
                    },
                    MuVersionId: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    MuResetTypeId: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    MuTypeId: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    MuPointId: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    OpenBetaTime: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    AlphaTestTime: {
                        valueNotEquals: "Vui lòng chọn"
                    },
                    AlphaTestDateStr: {
                        required: "Không để trống",
                        datemu: "Ngày không được lớn hơn ngày Open Beta"
                    },
                    OpenBetaDateStr: {
                        required: "Không để trống",
                        datemu: "Ngày không được nhỏ hơn ngày Alpha Test"
                    }
                },
                submitHandler: function (form) {

                    var response = grecaptcha.getResponse();
                    //recaptcha failed validation
                    if (response.length == 0) {
                        toastr.error("Vui lòng xác thực RECAPCHA")
                    }
                    else {
                        var l = $('#btn-action').ladda();
                        l.ladda('start');

                        form.submit();
                    }

                }
            });
        },
        compare: function (a, b) {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            let self = this;
            return (
                isFinite(a = this.convert(a).valueOf()) &&
                    isFinite(b = self.convert(b).valueOf()) ?
                    (a > b) - (a < b) :
                    NaN
            );
        },
        convert: function (d) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                    d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                        d.constructor === Number ? new Date(d) :
                            d.constructor === String ? new Date(d) :
                                typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                    NaN
            );
        },
    }
}

UploadPostController.Init();