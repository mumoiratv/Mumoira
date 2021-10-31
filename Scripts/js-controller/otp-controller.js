var OTPController = {
    Init: function () {

        OTPController.Methods.initFirebase();
        this.Register();
    },
    Register: function () {
        //validation
        let self = this;

        $(document).ready(function () {
            $('.otp-event').each(function () {
                var $input = $(this).find('.otp-number-input');
                var $submit = $('#confirm');
                $input.keydown(function (ev) {
                    otp_val = $(this).val();
                    if (ev.keyCode == 37) {
                        $(this).prev().focus();
                        ev.preventDefault();
                    } else if (ev.keyCode == 39) {
                        $(this).next().focus();
                        ev.preventDefault();
                    } else if (otp_val.length == 1 && ev.keyCode != 8 && ev.keyCode != 46) {
                        otp_next_number = $(this).next();
                        if (otp_next_number.length == 1 && otp_next_number.val().length == 0) {
                            otp_next_number.focus();
                        }
                    } else if (otp_val.length == 0 && ev.keyCode == 8) {
                        $(this).prev().val("");
                        $(this).prev().focus();
                    } else if (otp_val.length == 1 && ev.keyCode == 8) {
                        $(this).val("");
                    } else if (otp_val.length == 0 && ev.keyCode == 46) {
                        next_input = $(this).next();
                        next_input.val("");
                        while (next_input.next().length > 0) {
                            next_input.val(next_input.next().val());
                            next_input = next_input.next();
                            if (next_input.next().length == 0) {
                                next_input.val("");
                                break;
                            }
                        }
                    }

                }).focus(function () {
                    $(this).select();
                    var otp_val = $(this).prev().val();
                    if (otp_val === "") {
                        $(this).prev().focus();
                    } else if ($(this).next().val()) {
                        $(this).next().focus();
                    }
                }).keyup(function (ev) {
                    otpCodeTemp = "";
                    $input.each(function (i) {
                        if ($(this).val().length != 0) {
                            $(this).addClass('otp-filled-active');
                        } else {
                            $(this).removeClass('otp-filled-active');
                        }
                        otpCodeTemp += $(this).val();
                    });
                    if ($(this).val().length == 1 && ev.keyCode != 37 && ev.keyCode != 39) {
                        $(this).next().focus();
                        ev.preventDefault();
                    }

                    let result = "";
                    $input.each(function (i) {
                        result += $(this).val();
                        if ($(this).val() != '') {
                            $submit.prop('disabled', false);
                        } else {
                            $submit.prop('disabled', true);
                        }
                    });
                    $("#otp-code-hidden").val(result);

                });
                $input.on("paste", function (e) {
                    self.Methods.handlePasteOTP(e);
                });
            });

        });

    },
    Methods: {
        initSubmitOtp: function (callBack) {
            $("#confirm").click(function () {
                var lad = $(this).ladda();
                lad.ladda('start');
                OTPController.Methods.submitPhoneNumberAuthCode(lad, function (cb) {
                    callBack();
                });
            })
        },
        initFirebase: function () {
            var firebaseConfig = {
                apiKey: "AIzaSyDSm_ob2MsToblbJ9MTPljdN5P-6XaDvMA",
                authDomain: "mumoira-51c7e.firebaseapp.com",
                projectId: "mumoira-51c7e",
                storageBucket: "mumoira-51c7e.appspot.com",
                messagingSenderId: "101319506396",
                appId: "1:101319506396:web:30fe0c101779f5dec03719",
                measurementId: "G-6C5MQE4ERQ"
            };

            firebase.initializeApp(firebaseConfig);
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "normal",
                    callback: function (response) {
                        if (response != "") {
                            // $(".otp-wrapper").attr("style", "max-height:500px");
                        }
                        //AuthenController.Methods.submitPhoneNumberAuth();
                    }
                }
            );

            //firebase.auth().onAuthStateChanged(function (user) {
            //    if (user) {
            //        console.log("USER LOGGED IN");
            //    } else {
            //        // No user is signed in.
            //        console.log("USER NOT LOGGED IN");
            //    }
            //});
        },
        submitPhoneNumberAuth: function () {
            var phoneNumber = $("#phone-number-otp").val();
            if (phoneNumber.charAt(0) == "0") {
                phoneNumber = "+84" + phoneNumber.slice(1);
            }
            $(".phone-number-otp-text").html(phoneNumber);
            var appVerifier = window.recaptchaVerifier;
            firebase
                .auth()
                .signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(function (confirmationResult) {
                    window.confirmationResult = confirmationResult;
                    $("#recaptcha-container").hide();
                    $(".otp-wrapper").attr("style", "max-height:500px");
                })
                .catch(function (error) {
                    toastr.error(error.message);
                    console.log(error);
                });
        },
        submitPhoneNumberAuthCode: function (lad,callBack) {
            var code = $("#otp-code-hidden").val();
            window.confirmationResult
                .confirm(code)
                .then(function (result) {
                    lad.ladda('stop');
                    callBack();
                    //window.form.submit();
                })
                .catch(function (error) {
                    if (error.message.includes("The SMS verification")) {
                        toastr.error("Mã OTP bạn vừa nhập không hợp lệ! Vui lòng thử lại");
                    }
                    else {
                        toastr.error(error.message);
                    }
                    lad.ladda('stop');
                    console.log(error);
                });
        },
        handlePasteOTP: function (e) {
            var clipboardData = e.clipboardData || window.clipboardData || e.originalEvent.clipboardData;
            var pastedData = clipboardData.getData('Text');
            var arrayOfText = pastedData.toString().split('');
            /* for number only */
            if (isNaN(parseInt(pastedData, 10))) {
                e.preventDefault();
                return;
            }
            for (var i = 0; i < arrayOfText.length; i++) {
                if (i >= 0) {
                    document.getElementById('otp-number-input-' + (i + 1)).value = arrayOfText[i];
                } else {
                    return;
                }
            }
            e.preventDefault();
        }
    }
}

OTPController.Init();