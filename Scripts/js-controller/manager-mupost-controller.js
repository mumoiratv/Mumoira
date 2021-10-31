var ManagerMuPostController = {
    Init: function () {
        this.Register();
    },
    Data: {
        MuPostId: 0,

    },
    Register: function () {
        let self = this;
        $(".btn-push").click(function () {
            let id = $(this).data("id");
            ManagerMuPostController.Data.MuPostId = id;
            $("#vip-modal").modal("show");
        })

        $(".wrap-push .push-item").click(function () {
            $(this).closest(".wrap-push").find(".push-item").removeClass("active");
            $(this).addClass("active");
        })
       
        $("#btn-action").click(function () {
            self.Methods.buyVip();
        })

        this.Methods.deleteMuPost();

    },
    Methods: {
        buyVip: function () {
            

            var optionId = $(".wrap-banner .push-item.active").data("option");
            let model = {
                MuPostId: ManagerMuPostController.Data.MuPostId,
                MuPostOptionId: optionId
            };

            var l = $('#btn-action').ladda();
            l.ladda('start');
            $.ajax({
                url: `/buy-vip`,
                type: "POST",
                data: JSON.stringify(model),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    toastr.success(res.Message);
                    l.ladda('stop');
                    window.location.href = $(".tab-main > a.active").attr("href") + "?type=success&message=" + res.Message;
                },
                error: function (jqXHR, exception) {
                    toastr.error(jqXHR.responseJSON.Message);
                    l.ladda('stop');
                }
            });
        },
        deleteMuPost: function () {
            $(".delete-post").click(function () {
                let self = this;
                $.confirm({
                    title: 'Xóa tin !',
                    type: 'red',
                    content: 'Tin này sẽ được xóa vĩnh viễn và không thể khôi phục lại',
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
        }
    }
}

ManagerMuPostController.Init();