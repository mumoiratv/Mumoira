var UserController = {
    Init: function () {
        this.Register();
    },
    Register: function () {
        $(".select-upload").click(function () {
            $("#file-image").click();
        })

        $("#file-image").on('change', function () {
            showLoading("Đang tải ảnh lên !");
            var $files = $(this).get(0).files;
            if ($files.length) {
                if ($files[0].size > $(this).data('max-size') * 1024) {
                    toastr.error('Vui lòng chọn file có dung lượng nhỏ hơn!');
                    return false;
                }
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
                        console.log(response);
                        var obj = JSON.parse(response);
                        $("#txt_Avatar").val(obj.data.link);
                        $(".file-upload-preview").attr("src", obj.data.link)
                        $("#a_Avatar").attr("href", obj.data.link);

                    }).catch(err => {
                        toastr.error("Lỗi khi tải ảnh lên! Vui lòng thử lại");

                    }).done(res => {
                        $("#file-image").val("");
                        hideLoading();
                    });
                },1000)

            }
        });
        //validation
        this.Methods.validationUpdateUser();
    },
    Methods: {
        userAction: function () {
            let name = $("#txt_FullName").val();
            let fb = $("#txt_FbUrl").val();
            let phone = $("#txt_PhoneNumber").val();
            let email = $("#txt_Email").val();
            let address = $("#txt_Address").val();
            let date = $('#datetimepicker').data("DateTimePicker").date()._d;
            let birthDay = dateConvertToString(date);
            let password = $("#txt_Password").val();
            let avatar = $("#txt_Avatar").val();
            let userId = $("#userId").val();

            let model = {
                Id: parseInt(userId),
                Name: name != null ? name.trim() : name,
                URLFb: fb != null ? fb.trim() : fb,
                PhoneNumber: phone != null ? phone.trim() : phone,
                Email: email != null ? email.trim() : email,
                Address: address != null ? address.trim() : address,
                BirthDay: birthDay,
                PasswordHash: password != null ? password.trim() : password,
                Avatar: avatar != null ? avatar.trim() : avatar
            }

            let self = this;
            var l = $('#btn-action').ladda();
            l.ladda('start');

            //console.log(model);
            $.ajax({
                url: `/Manager/UpdateUser`,
                type: "POST",
                data: JSON.stringify(model),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    if (res.Success) {
                        $("#alert").removeClass("alert-danger").addClass("alert-success")
                        $("#alert .content").html(res.Message);
                        $("#alert").fadeIn(100).delay(2000).fadeOut(1000);
                        l.ladda('stop');
                    }
                    else {
                        $("#alert").removeClass("alert-success").addClass("alert-danger")
                        $("#alert .content").html(res.Message);
                        $("#alert").fadeIn(100).delay(2000).fadeOut(1000);
                        toastr.warning(res.Message);
                        l.ladda('stop');
                    }
                    console.log(res);
                },
                error: function (jqXHR, exception) {
                    l.ladda('stop');
                }
            });
        },
        validationUpdateUser: function () {
            let self = this;
            $("#form-user").validate({
                rules: {
                    fullName: {
                        required: true
                    },
                    phone: {
                        digits: true,
                        minlength: 10,
                        maxlength: 12
                    },
                    email: {
                        email: true
                    },
                    password: {
                        minlength: 5
                    }
                },
                messages: {
                    fullName: {
                        required: "Vui lòng nhập họ và tên"
                    },
                    phone: {
                        digits: "Chỉ nhập số",
                        minlength: "Vui lòng nhập tối thiểu 10 số",
                        maxlength: "Số điện thoại chỉ được phép nhập tối đa 12 số"
                    },
                    email: {
                        email: "Email không đúng định dạng"
                    },
                    password: {
                        minlength: "Mật khẩu tối thiểu 5 ký tự"
                    }
                },
                submitHandler: function () {
                    self.userAction();
                }
            });
        }
    }
}

UserController.Init();