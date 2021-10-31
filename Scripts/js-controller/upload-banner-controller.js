var UploadBannerController = {
    Init: function () {
        this.Register();
    },
    Data: {
        bannerExtendId: 0
    },
    Register: function () {
        $("#file-image").on('change', function (file) {
            let self = this;
            let $position = $(".main-position .position-item.active");
            let widthBanner = $position.data("width") | 0;
            let heightBanner = $position.data("height") | 0;

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
                    if (this.width > widthBanner + 60 || this.width < widthBanner - 60 || this.height > heightBanner + 30 || this.height < heightBanner - 30) {
                        let message = "Vui lòng chọn size Banner có kích thước dài {0}, rộng {1}";
                        message = message.replace("{0}", widthBanner);
                        message = message.replace("{1}", heightBanner);
                        toastr.error(message);

                        //Xóa dữ liệu cũ
                        $(self).val("");
                        return;
                    }
                    else {
                        showLoading("Đang tải ảnh lên !");
                        var $files = $(self).get(0).files;
                        if ($files.length) {
                            if ($files[0].size > $(self).data('max-size') * 1024) {
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
                                    var obj = JSON.parse(response);
                                    $(".file-upload-preview").attr("src", obj.data.link);
                                    $("#a_Avatar").attr("href", obj.data.link);
                                    $("#txt_Avatar").val(obj.data.link);

                                }).catch(err => {
                                    toastr.error("Lỗi khi tải ảnh lên! Vui lòng thử lại");

                                }).done(res => {

                                    hideLoading();
                                });
                            }, 1000)

                        }
                    }
                    _URL.revokeObjectURL(objectUrl);
                };
                img.src = objectUrl;
                //const reader = new FileReader();

                //reader.addEventListener("load", function () {
                //    // convert image file to base64 string
                //    // preview.src = reader.result;
                //    //let $img = $(".file-upload-preview");
                //    //$img.attr("src", reader.result);
                //    //let widthImg = $img.width();
                //    //let heightImg = $img.height();

                //console.log(widthImg);
                //console.log(heightImg);
                //}, false);

                //if ($files[0]) {
                //    reader.readAsDataURL($files[0]);
                //}

            }

        });

        ///Banner

        $(".main-position .position-item").click(function () {
            $(this).closest(".main-position").find(".position-item").removeClass("active");
            $(this).addClass("active");
            $("#position-view").val($(this).data("position"));
            $("#file-image").val("");


            let widthBanner = $(this).data("width") | 0;
            let heightBanner = $(this).data("height") | 0;
            let className = "img-" + widthBanner + "-" + heightBanner;

            $(".custom-banner").removeClass("img-210-400");
            $(".custom-banner").removeClass("img-780-280");
            $(".custom-banner").removeClass("img-780-110");
            $(".custom-banner").addClass(className);
            if (widthBanner == 210) {
                $("#a_Avatar").attr("href", "/Content/images/icon/no_image_doc.jpg")
                $(".file-upload-preview").attr("src", "/Content/images/icon/no_image_doc.jpg")
            }
            else if (heightBanner == 280) {
                $("#a_Avatar").attr("href", "/Content/images/icon/no_image_giua_to.jpg")
                $(".file-upload-preview").attr("src", "/Content/images/icon/no_image_giua_to.jpg")
            }
            else {
                $("#a_Avatar").attr("href", "/Content/images/icon/no_image_full.jpg")
                $(".file-upload-preview").attr("src", "/Content/images/icon/no_image_full.jpg")
            }

            let position = $(this).data("position");
            showLoading();
            UploadBannerController.Methods.loadOptionBanner(position, ".position-loaded");
        })

        $(".wrap-push .position-loaded").on("click", ".push-item", function () {
            $(this).closest(".wrap-banner").find(".push-item").removeClass("active");
            $(this).addClass("active");
            $("#banner-option-id").val($(this).data("option"))
        })

        $(".wrap-push .position-extend-loaded").on("click", ".push-item", function () {
            $(this).closest(".wrap-banner").find(".push-item").removeClass("active");
            $(this).addClass("active");
        })

        //Gia hạn banner
        $(".btn-extend-banner").click(function () {
            let id = $(this).data("id");
            showLoading();
            $.get("/find-banner?id=" + id).then(banner => {
                if (banner != null) {
                    console.log(banner);
                    UploadBannerController.Data.bannerExtendId = id;
                    UploadBannerController.Methods.loadOptionBanner(banner.PositionView, ".position-extend-loaded");
                    $("#extend-modal").modal("show");
                }
                else {
                    toastr.error("Không tìm thấy Banner");
                    hideLoading();
                }
            })
        });

        $("#btn-action-extend").click(function () {
            let optionId = $(".wrap-banner .position-extend-loaded").find(".push-item.active").data("option");
            let bannerId = UploadBannerController.Data.bannerExtendId;
            var l = $(this).ladda();
            l.ladda('start');
            $.get("/extend-date-expire?bannerId=" + bannerId + "&optionId=" + optionId).then(res => {
                if (res.Success) {
                    window.location.href = $(".tab-main .tab-item.active").attr("href") + "?type=success&message=" + res.Message;
                }
            }).catch(err => {
                l.ladda('stop');
                toastr.error(err.responseJSON.Message);

            }).done(d => {
                l.ladda('stop');
            })
        });

        $(".delete-post").click(function () {
            let self = this;
            $.confirm({
                title: 'Xóa Banner !',
                type: 'red',
                content: 'Banner này sẽ được xóa vĩnh viễn và không thể khôi phục lại',
                autoClose: 'cancelAction|10000',
                escapeKey: 'cancelAction',
                buttons: {
                    confirm: {
                        btnClass: 'btn-red',
                        text: 'Chắc chắn xóa !',
                        action: function () {
                            var url = $(self).data("url");
                            window.location.href = url;
                        }
                    },
                    cancelAction: {
                        text: 'Hủy bỏ',
                        action: function () {
                        }
                    }
                }
            });
        })

        $.validator.addMethod("http", function (value, element, arg) {
            if (value == "" || value == null) {
                return true;
            }
            return value.includes("http://") || value.includes("https://");
        });

        this.Methods.validateBanner();
    },
    Methods: {
        submitBanner: function () {
            let position = $(".main-position .position-item.active").data("position");
            let option = $(".wrap-banner .push-item.active").data("option");
            let title = $("#txt_Title").val();
            let homeUrl = $("#txt_HomeUrl").val();
            let avatar = $("#txt_Avatar").val();
            if (parseInt(position) < 0) {
                toastr.error("Vui lòng chọn vị trí");
                return;
            }

            if (parseInt(option) < 0) {
                toastr.error("Vui lòng chọn gói thuê");
                return;
            }

            if (avatar == "") {
                toastr.error("Vui lòng upload hình banner");
                return;
            }

            let model = {
                PositionView: position,
                BannerOptionPushId: option,
                HomeUrl: homeUrl,
                Title: title,
                Avatar: avatar
            };

            var l = $('#btn-action').ladda();
            l.ladda('start');
            $.ajax({
                url: `/upload-banner`,
                type: "POST",
                data: JSON.stringify(model),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    toastr.success(res.Message);
                    l.ladda('stop');
                    window.location.href = "/quan-ly-banner-1-" + position + "-1.htm?type=success&message=" + res.Message;
                },
                error: function (jqXHR, exception) {
                    toastr.error(jqXHR.responseJSON.Message);
                    l.ladda('stop');
                }
            });

        },
        loadOptionBanner: function (position, className) {
            $(className).empty();
            let temp = `
                    <div class="push-item {0}" data-option="{1}">
                         <i class="far fa-bookmark"></i>
                         <p class="time">{2}</p>
                         <p class="coin"> {3} Gold</p>
                     </div>
                        `;

            let allTempData = "<div class='d-flex  justify-content-around'>";

            $.get("/get-options-position?position=" + position).then(res => {

                res.forEach((element, index) => {
                    let tempReplace = temp;
                    tempReplace = tempReplace.replace("{0}", index == 0 ? "active" : "");
                    tempReplace = tempReplace.replace("{1}", element.Id);
                    tempReplace = tempReplace.replace("{2}", element.Title);
                    let price = "";
                    if ((element.PriceOption + "").length == 1) {
                        price = "0" + element.PriceOption;
                    }
                    else {
                        price = element.PriceOption;
                    }
                    tempReplace = tempReplace.replace("{3}", price);
                    if ((index + 1) % 2 == 0) {
                        allTempData = allTempData + tempReplace + " </div><div class='d-flex  justify-content-around'>";
                    }
                    else {
                        allTempData = allTempData + tempReplace;
                    }
                })

                allTempData = allTempData + "</div>";
                $(className).html(allTempData);
                console.log(res);
            }).catch(err => {
                console.log(err);
            }).done(d => {
                hideLoading();
            });
        },
        validateBanner: function () {
            let self = this;

            $("#form-banner").validate({
                rules: {
                    Title: {
                        required: true
                    },
                    HomeUrl: {
                        required: true,
                        http: true
                    }
                },
                messages: {
                    Title: {
                        required: "Không để trống"
                    },
                    HomeUrl: {
                        required: "Không để trống",
                        http: "Không đúng định dạng đường dẫn"
                    }
                },
                submitHandler: function (form) {
                    self.submitBanner();
                }
            });
        }
    }
}

UploadBannerController.Init();