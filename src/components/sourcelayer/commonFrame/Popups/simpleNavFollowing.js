/*
 *  原创－反馈请邮件至：361899429@qq.com
 *  创建于20180000     最后修改20201231
 *  v1.0.2            --rebuild
 */

var simpleNavFollow = function (opts) {
    //设置默认参数
    var opt = {
        parentElement: "",
        nav: ".snf-nav",
        page: ".snf-page",
        leaveTop: 0,
        animation: 400,
        followCallBack: function (index) {
        },
        navCallBack: function (index) {
        }
    };
    //合并参数
    var option = $.extend(opt, opts);
    var $nav = $(option.nav);
    var $page = $(option.page);
    var leaveTop = option.leaveTop;
    var scrollElement = option.parentElement === "" ? window : option.parentElement;
    var snfArr=[];
    var k = 0, old_k = 0;
    var turning = false;
    var callBackState = {
        follow: false,
        nav: false
    };
    var dialog = {};
    var linkBind = function (obj) {
        obj.link.click(function (e) {
            e.preventDefault();
            if (!turning) {
                if (!$(this).hasClass("active")) {
                    var __scrollElement = option.parentElement === "" ? "html,body" : option.parentElement;
                    turning = true;
                    if (!callBackState.nav && typeof option.navCallBack === "function") setTimeout(function () {
                        option.navCallBack(obj.index)
                    }, option.animation + 20);
                    $(__scrollElement).animate({
                        scrollTop: obj.top
                    }, option.animation, function () {
                        setTimeout(function () {
                            turning = false;
                            if (!callBackState.follow && typeof option.followCallBack === "function") option.followCallBack(obj.index);
                        }, 20);
                    });

                }
            }
        })
    };
    dialog.init = function () {
        if($nav.length<=0) return false;
        if($nav.length!==$page.length) {
            console.log("导航数量与页面数量不匹配");
            return false;
        }
        if (option.parentElement !== "") {//若以父元素为滚动框顶，则需要position值为非static
            var parentElementPosition = $(option.parentElement).css("position");
            if (parentElementPosition === "static") {
                $(option.parentElement).css("position", "relative");
            }
        }
        for (var i = 0; i < $nav.length; i++) {
            var obj = {
                link: $nav.eq(i),
                index: i,
                page: $page.eq(i)
            };
            if (option.parentElement === "") {
                obj.top = obj.page.offset().top - leaveTop;
            } else {
                var scrollTop = $(scrollElement).scrollTop();
                var marginTop = obj.page.css("margin-top").replace("px", "") - 0;
                obj.top = Math.round(obj.page.position().top - leaveTop + marginTop + scrollTop);
            }
            snfArr.push(obj);
            linkBind(obj);
        }
        $(scrollElement).scroll(function () {
            var scrollTop = $(this).scrollTop();
            for (var i = 0; i < snfArr.length; i++) {
                if (scrollTop >= snfArr[i].top) {
                    k = i;
                }
            }
            k < 0 ? k = 0 : null;
            k >= snfArr.length ? k = snfArr.length - 1 : null;
            if (old_k !== k && !turning) {
                old_k = k;
                if (!callBackState.follow && typeof option.followCallBack === "function") option.followCallBack(k);
            }
            $nav.removeClass("active");
            snfArr[k].link.addClass("active");
        });
        if (option.initTo !== undefined && !isNaN(option.initTo)) {
            var initTo = option.initTo;
            if (typeof initTo === "string") initTo = initTo.trim();
            if (initTo === "") return false;
            if (initTo < 0 || initTo > snfArr.length - 1) return false;
            snfArr[initTo].link.trigger("click");
            option.initTo = undefined;
        }
    };

    dialog.getStopState = {
        follow: function () {
            return callBackState.follow
        },
        nav: function () {
            return callBackState.nav
        }
    };
    //暂停回调
    dialog.stopCallBack = {
        follow: function (boolean) {
            callBackState.follow = boolean === undefined ? true : boolean ? true : false;
        },
        nav: function (boolean) {
            callBackState.nav = boolean === undefined ? true : boolean ? true : false;
        }
    };
    dialog.destroyed = function () {
        $nav.off("click");
        $(scrollElement).off("scroll");
        $nav = $page = linkBind = dialog.init = dialog.getStopState = dialog.stopCallBack = dialog.destroyed = null;
        dialog =  null;
    };
    dialog.init();
    return dialog;
};