var AuthenController = {
    Init: function () {
        this.Register();
    },
    Register: function () {
        let self = this;
        //validation
        this.Methods.validationLogin();
        this.Methods.validationRegister();
        this.Methods.validationForgetPassword();
        OTPController.Methods.initSubmitOtp(function () {
            $("#isOk").val(true);
            window.form.submit();
        });
    },
    Methods: {
        login: function () {
            let self = this;
        },
        register: function () {
            let self = this;
        },
        validationLogin: function () {
            $("#form-login").validate({
                rules: {
                    Username: {
                        required: true,
                        digits: true,
                        minlength: 10,
                        maxlength: 12
                    },
                    Password: {
                        required: true,
                        minlength: 5
                    }
                },
                messages: {
                    Username: {
                        required: "Vui lòng nhập số điện thoại",
                        digits: "Chỉ nhập số.",
                        minlength: "Vui lòng nhập tối thiểu 10 số",
                        maxlength: "Số điện thoại chỉ được phép nhập tối đa 12 số"
                    },
                    Password: {
                        required: "Vui lòng nhập mật khẩu",
                        minlength: "Mật khẩu tối thiểu 5 ký tự",
                    }
                },
                submitHandler: function (form) {
                    var l = $('.btn-login').ladda();
                    l.ladda('start');
                    form.submit();
                }
            });
        },
        validationRegister: function () {
            $("#form-register").validate({
                rules: {
                    FullName: {
                        required: true
                    },
                    Username: {
                        required: true,
                        digits: true,
                        minlength: 10,
                        maxlength: 12,
                        remote: {
                            url: "/Authen/CheckUserExistValidation",
                            type: "get",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            cache: true,
                            dataFilter: function (response) {
                                var res = JSON.parse(response);
                                if (res.Success) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                return false;

                            }
                        }
                    },
                    Password: {
                        required: true,
                        minlength: 5
                    },
                    RePassword: {
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    }
                },
                messages: {
                    FullName: {
                        required: "Vui lòng nhập đầy đủ họ và tên"
                    },
                    Username: {
                        required: "Vui lòng nhập số điện thoại",
                        digits: "Chỉ nhập số",
                        minlength: "Vui lòng nhập tối thiểu 10 số",
                        maxlength: "Số điện thoại chỉ được phép nhập tối đa 12 số",
                        remote: "Số điện thoại đã tồn tại trong hệ thống"
                    },
                    Password: {
                        required: "Vui lòng nhập mật khẩu",
                        minlength: "Mật khẩu tối thiều 5 ký tự",
                    },
                    RePassword: {
                        required: "Vui lòng nhập mật khẩu",
                        minlength: "Mật khẩu tối thiều 5 ký tự",
                        equalTo: "Mật khẩu không khớp"
                    }
                },
                submitHandler: function (form) {
                    $("#modal-otp").modal("show");
                    OTPController.Methods.submitPhoneNumberAuth();
                    window.form = form;
                }
            });
        },
        validationForgetPassword: function () {
            $("#form-forget-password-0").validate({
                rules: {
                    Username: {
                        required: true,
                        digits: true,
                        minlength: 10,
                        maxlength: 12
                    }
                },
                messages: {
                    Username: {
                        required: "Vui lòng nhập số điện thoại",
                        digits: "Chỉ nhập số",
                        minlength: "Vui lòng nhập tối thiểu 10 số",
                        maxlength: "Số điện thoại chỉ được phép nhập tối đa 12 số"
                    }
                },
                submitHandler: function (form) {
                    AuthenController.Methods.checkUserExist(form);
                }
            });
        },
        checkUserExist: function (form) {
            var phoneNumber = $("#phone-number-otp").val();
            $.get("/Authen/CheckUserExist?username=" + phoneNumber).then(res => {
                if (res.Success) {
                    $("#modal-otp").modal("show");
                    OTPController.Methods.submitPhoneNumberAuth();
                    window.form = form;
                }
            }).catch(err => {
                toastr.error(err.responseJSON.Message);
            })
        }

    }
}

AuthenController.Init();