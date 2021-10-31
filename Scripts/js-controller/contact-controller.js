var ContactController = {
    Init: function () {
        this.Register();
    },
    Register: function () {
        let self = this;
        //validation
        this.Methods.validationContact();
       
    },
    Methods: {
        validationContact: function () {
            $("#form-contact").validate({
                rules: {
                    FullName: {
                        required: true
                    },
                    Mobile: {
                        required: true,
                        digits: true,
                        minlength: 10,
                        maxlength: 12
                    },
                    Email: {
                        required: false,
                        email:true
                    },
                    Content: {
                        required: true
                    },
                },
                messages: {
                    FullName: {
                        required: "Không để trống"
                    },
                    Mobile: {
                        required: "Vui lòng nhập số điện thoại",
                        digits: "Chỉ nhập số.",
                        minlength: "Vui lòng nhập tối thiểu 10 số",
                        maxlength: "Số điện thoại chỉ được phép nhập tối đa 12 số"
                    },
                    Email: {
                        email: "Email không đúng định dạng"
                    },
                    Content: {
                        required: "Không để trống"
                    },
                  
                },
                submitHandler: function (form) {
                    form.submit();
                }
            });
        }
    }
}

ContactController.Init();