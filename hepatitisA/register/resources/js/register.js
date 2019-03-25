haApp.controller('registerController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading('正在加载..', 'div');

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //$scope.vConsole = new VConsole();
        new Ripple({
            opacity : 0.6,  //水波纹透明度
            speed : 1,      //水波纹扩散速度
            bgColor : "#fff", //水波纹颜色
            cursor : true  //是否显示手型指针
        });

        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.register = true;
        $scope.informed = false;
        $scope.autograph = false;
        $scope.agent = false;
        $scope.autographInterviewed = '';   //本人签字
        $scope.autographAgent = '';         //代理人签字
        $scope.isInterviewed = false;       //是否本人签字
        $scope.isAgent = false;             //是否代理人签字
        $scope.isRelationship = false;      //是否选择关系
        //$scope.isTouchedI = false;          //是否本人触碰过屏幕
        //$scope.isTouchedA = false;          //是否代理人触碰过屏幕
        $scope.QuestionVisit = false;
        $scope.BloodCollection = false;
        $scope.AgentRelationship = '';
        $scope.relationship = [
            {value:'请选择',text:'请选择'},
            {value:'父亲',text:'父亲'},
            {value:'母亲',text:'母亲'},
            {value:'丈夫',text:'丈夫'},
            {value:'妻子',text:'妻子'},
            {value:'儿子',text:'儿子'},
            {value:'女儿',text:'女儿'},
            {value:'哥哥',text:'哥哥'},
            {value:'弟弟',text:'弟弟'},
            {value:'姐姐',text:'姐姐'},
            {value:'妹妹',text:'妹妹'},
            {value:'爷爷',text:'爷爷'},
            {value:'奶奶',text:'奶奶'},
            {value:'外公',text:'外公'},
            {value:'外婆',text:'外婆'},
            {value:'叔父',text:'叔父'},
            {value:'伯父',text:'伯父'},
            {value:'姑姑',text:'姑姑'},
            {value:'舅舅',text:'舅舅'},
            {value:'姨妈',text:'姨妈'},
            {value:'表兄',text:'表兄'},
            {value:'堂兄',text:'堂兄'},
            {value:'表姐',text:'表姐'},
            {value:'堂姐',text:'堂姐'},
            {value:'女婿',text:'女婿'},
            {value:'儿媳',text:'儿媳'}
        ];

        $scope.Name = '';
        $scope.PhoneNo = '';
        $scope.IDCard = '';
        $scope.Code = '';

        /*$.ajax({
            async: false,
            method: 'get',
            url:'/wxPayH5Api/payIndex',
            data:{
                account:$scope.account,
                openId:$scope.openId
            },
            success:function (Data) {
                var data = (JSON.parse(Data)).data;
                $scope.openId = data.openId;//微信openID
                $scope.patientId = data.patientId;//病人id
                $scope.addaUrl = data.addaUrl;//接口平台url
                $scope.patientPlatformKey = data.accessKey;//key

                mui.hideLoading();

            },
            error:function (err) {
                console.log(err);
                mui.toast('获取用户异常');
                mui.hideLoading();
            }
        });*/

        setTimeout(function () {
            mui.hideLoading();
        }, 500);

        /*mui.alert('此为内部科学研究项目，需联系医生扫码注册加入', '&nbsp;', function() {
            wx.closeWindow();
        });*/

        // var I = document.getElementById('HA-autograph');
        // I.addEventListener('touchmove', function(event) {
        //     //console.log(event.timeStamp);
        //     var timeStamp = event.timeStamp;
        //     if(timeStamp > 1000){
        //         $scope.isTouchedI = true;
        //     }
        //     //event.preventDefault();// 阻止浏览器默认事件，重要 
        // }, false);
        //
        // var A = document.getElementById('HA-agent');
        // A.addEventListener('touchmove', function(event) {
        //     //console.log(event.timeStamp);
        //     var timeStamp = event.timeStamp;
        //     if(timeStamp > 1000){
        //         $scope.isTouchedA = true;
        //     }
        //     //event.preventDefault();// 阻止浏览器默认事件，重要 
        // }, false);

    };

    /**
     * 清空
     * @param type
     */
    $scope.empty = function (type) {
        switch (type) {
            case 0:
                $scope.isInterviewed = false;
                //$scope.isTouchedI = false;
                $('#pre-value-interviewed')
                    .css('background', 'transparent')
                    .css('background-repeat', 'no-repeat')
                    .css('background-position', 'center center')
                    .css('background-size', 'contain');
                break;
            case 1:
                $scope.isAgent = false;
                //$scope.isTouchedA = false;
                $('#pre-value-agent')
                    .css('background', 'transparent')
                    .css('background-repeat', 'no-repeat')
                    .css('background-position', 'center center')
                    .css('background-size', 'contain');
                break;
            case 2:
                $scope.isRelationship = false;
                $scope.AgentRelationship = '';
                var html = '<span>请选择</span>';
                $('#relationship').html(html);
                break;
        }
    };

    //初始化关系选择器
    $scope.initPicker = function () {
        var Picker = new mui.PopPicker({
            layer: 1
        });
        Picker.setData($scope.relationship);

        $('#relationship').on('tap', function(){
            Picker.show(function(items){
                var text = items[0].text;
                var val = items[0].value;

                //console.log(items[0]);
                var html = '';
                if(val === '请选择'){
                    html = '<span>' + text + '</span>';
                    $scope.isRelationship = false;
                    $scope.AgentRelationship = '';
                }else{
                    html = '<span style="color: #000000;">' + text + '</span>';
                    $scope.isRelationship = true;
                    $scope.AgentRelationship = text;
                }
                $('#relationship').html(html);

                Picker.dispose();

            });

        });
    };

    //受访者写字板
    $scope.getInterviewed = function () {
        var Interviewed = new Tablet("#HA-interviewed-container",{
            defaultColor: "#000000",
            otherHtml: $("#temp-interviewed").html(),
            onInit: function (){
                var that = this;
                var container = this.container;
                that.rotate(90);
                container.find('#HA-interviewed-submit').on("click", function (){
                    if(!that.isMobile){
                        //alert("请按f12打开控制台查看base64图片数据！");
                    }

                    $scope.autographInterviewed = that.getBase64();
                    /********************是否签名的判断-start********************/
                    var file = $scope.dataURLtoFile($scope.autographInterviewed, 'test');
                    var reader = new FileReader();
                    var img = new Image();
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');

                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        //e.target.result就是图片的base64地址信息
                        img.src = e.target.result;
                    };

                    img.onload = function() {
                        var img_width = 100;//this.width;
                        var img_height = 100;//this.height;

                        // 设置画布尺寸
                        canvas.width = img_width;
                        canvas.height = img_height;

                        // 将图片按像素写入画布
                        context.drawImage(this, 0, 0, img_width, img_height);

                        // 读取图片像素信息
                        var imageData = context.getImageData(0, 0, img_width, img_height);
                        var arr = imageData.data;
                        var brr = [];//结果值
                        for(var a=0;a<arr.length;a++){
                            var arrItem = arr[a];
                            if(arrItem !== 0){
                                brr.push(arrItem);
                            }
                        }

                        //说明签字了
                        if(brr.length > 0){
                            $scope.isInterviewed = true;
                            $('#pre-value-interviewed')
                                .css('background', 'url(' + $scope.autographInterviewed + ')')
                                .css('background-repeat', 'no-repeat')
                                .css('background-position', 'center center')
                                .css('background-size', 'contain');
                            $scope.submitEdit();
                        }else{
                            $scope.isInterviewed = false;
                            mui.toast('您未签名');
                            return false;
                        }

                    };
                    /********************是否签名的判断-end********************/

                });
                container.find('#HA-interviewed-back').on("click", function (){
                    $scope.isInterviewed = false;
                    $scope.backEdit();

                });

            }

        });

    };

    //代理人写字板
    $scope.getAgent = function () {
        var agent = new Tablet("#HA-agent-container",{
            defaultColor: "#000000",
            otherHtml: $("#temp-agent").html(),
            onInit: function (){
                var that = this;
                var container = this.container;
                that.rotate(90);
                container.find('#HA-agent-submit').on("click", function (){
                    $scope.autographAgent = that.getBase64();
                    /********************是否签名的判断-start********************/
                    var file = $scope.dataURLtoFile($scope.autographAgent, 'test');
                    var reader = new FileReader();
                    var img = new Image();
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');

                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        //e.target.result就是图片的base64地址信息
                        img.src = e.target.result;
                    };

                    img.onload = function() {
                        var img_width = 100;//this.width;
                        var img_height = 100;//this.height;

                        // 设置画布尺寸
                        canvas.width = img_width;
                        canvas.height = img_height;

                        // 将图片按像素写入画布
                        context.drawImage(this, 0, 0, img_width, img_height);

                        // 读取图片像素信息
                        var imageData = context.getImageData(0, 0, img_width, img_height);
                        var arr = imageData.data;
                        var brr = [];//结果值
                        for(var a=0;a<arr.length;a++){
                            var arrItem = arr[a];
                            if(arrItem !== 0){
                                brr.push(arrItem);
                            }
                        }

                        //说明签字了
                        if(brr.length > 0){
                            $scope.isAgent = true;
                            $('#pre-value-agent')
                                .css('background', 'url(' + $scope.autographAgent + ')')
                                .css('background-repeat', 'no-repeat')
                                .css('background-position', 'center center')
                                .css('background-size', 'contain');
                            $scope.submitEdit();
                        }else{
                            $scope.isAgent = false;
                            mui.toast('您未签名');
                            return false;
                        }

                    };
                    /********************是否签名的判断-end********************/

                });
                container.find('#HA-agent-back').on("click", function (){
                    $scope.isAgent = false;
                    $scope.backEdit();

                });
                /*container.find(".get_blob").on("click", function (){
                    that.getBlob();
                });*/
            }

        });

    };

    //获取当前时间
    $scope.getNowYear = function () {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        $scope.nowTime = year + '年' + month + '月' + day + '日';

    };

    //进入知情同意书编辑
    $scope.editInformed = function () {
        mui.showLoading('正在加载..', 'div');

        setTimeout(function () {
            $scope.register = false;
            $scope.informed = true;
            $scope.autograph = false;
            $scope.agent = false;
            $scope.autographInterviewed = '';
            $scope.autographAgent = '';
            $scope.$applyAsync();
            mui.hideLoading();
        }, 500);

    };

    //知情书返回注册首页
    $scope.backIndex = function () {
        mui.showLoading('正在加载..', 'div');

        setTimeout(function () {
            $scope.register = true;
            $scope.informed = false;
            $scope.autograph = false;
            $scope.agent = false;
            $scope.$applyAsync();
            mui.hideLoading();
        }, 500);

    };

    //知情书确认并返回注册首页
    $scope.submitBackIndex = function () {

        if($scope.QuestionVisit === false && $scope.BloodCollection === false){
            mui.alert('请至少选择问卷调查或血样采集', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === false && $scope.isAgent === false){
            mui.alert('请本人签名或代理人签名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isRelationship === true){
            mui.alert('本人签名后无需选择关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isAgent === true){
            mui.alert('请只签一种名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isAgent === true && $scope.isRelationship === false){
            mui.alert('请选择与受访者关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        $('.HA-register-informed').removeClass('no-signed').addClass('signed');

        mui.showLoading('正在加载..', 'div');

        setTimeout(function () {
            $scope.register = true;
            $scope.informed = false;
            $scope.autograph = false;
            $scope.agent = false;
            $scope.$applyAsync();
            mui.hideLoading();
        }, 500);
    };

    //签字页返回编辑知情书
    $scope.backEdit = function () {
        mui.showLoading('&nbsp;', 'div');

        setTimeout(function () {
            $scope.register = false;
            $scope.informed = true;
            $scope.autograph = false;
            $scope.agent = false;
            $scope.autographInterviewed = '';
            $scope.autographAgent = '';
            $('#pre-value-interviewed')
                .css('background', 'transparent')
                .css('background-repeat', 'no-repeat')
                .css('background-position', 'center center')
                .css('background-size', 'contain');
            $('#pre-value-agent')
                .css('background', 'transparent')
                .css('background-repeat', 'no-repeat')
                .css('background-position', 'center center')
                .css('background-size', 'contain');
            $scope.$applyAsync();
            mui.hideLoading();
        }, 500);

        $scope.toBottom();
    };

    //签字页确认后返回编辑知情书
    $scope.submitEdit = function () {
        mui.showLoading('&nbsp;', 'div');

        setTimeout(function () {
            $scope.register = false;
            $scope.informed = true;
            $scope.autograph = false;
            $scope.agent = false;
            $scope.$applyAsync();
            mui.hideLoading();
        }, 500);

        $scope.toBottom();
    };

    //进入受访者签名
    $scope.initInterviewed = function () {
        mui.showLoading('正在加载..', 'div');

        setTimeout(function () {
            mui.toast('请锁定手机竖排方向');
            $scope.register = false;
            $scope.informed = false;
            $scope.autograph = true;
            $scope.agent = false;
            $scope.$applyAsync();

            mui.hideLoading();
        }, 500);
    };

    //进入代理人签名
    $scope.initAgent = function () {
        mui.showLoading('正在加载..', 'div');

        setTimeout(function () {
            mui.toast('请锁定手机竖排方向');
            $scope.register = false;
            $scope.informed = false;
            $scope.autograph = false;
            $scope.agent = true;
            $scope.$applyAsync();

            mui.hideLoading();
        }, 500);
    };

    //滑动到底部
    $scope.toBottom = function () {
        //将页面滑动到最底部
        var height = +($(document).height()) + 1000;
        $('html, body').animate({
            scrollTop: height
        }, 500);
    };

    //获取验证码
    $scope.getVerifyCode = function () {
        console.log($scope.Name);
        if($scope.Name === ''){
            mui.alert('请填写姓名', '提示', function() {

            });
            return false;
        }

        if($scope.PhoneNo === ''){
            mui.alert('请填写手机号', '提示', function() {

            });
            return false;
        }

        if(!(common.isPhoneNo($scope.PhoneNo))){
            mui.alert('手机号格式有误', '提示', function() {

            });
            return false;
        }

        if($scope.IDCard === ''){
            mui.alert('请填写身份证号', '提示', function() {

            });
            return false;
        }

        if(!(common.isIdCardNo($scope.IDCard))){
            mui.alert('身份证格式有误', '提示', function() {

            });
            return false;
        }

        if($scope.QuestionVisit === false && $scope.BloodCollection === false){
            mui.alert('请至少选择问卷调查或血样采集', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === false && $scope.isAgent === false){
            mui.alert('请本人签名或代理人签名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isRelationship === true){
            mui.alert('本人签名后无需选择关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isAgent === true){
            mui.alert('请只签一种名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isAgent === true && $scope.isRelationship === false){
            mui.alert('请选择与受访者关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        var getCode = $('#HA-getCode');

        var InterValObj;    //timer变量，控制时间
        var count = 3;     //间隔函数，1秒执行
        var curCount;       //当前剩余秒数

        curCount = count;

        //设置button效果，开始计时
        getCode.attr("disabled", "true");
        //getCode.css('background', '#cccccc').css('border', '1px solid #cccccc');

        getCode.html(curCount + "秒后获取");
        InterValObj = window.setInterval(function () {
            if (curCount === 1) {
                window.clearInterval(InterValObj);//停止计时器
                getCode.removeAttr("disabled");//启用按钮
                //getCode.css('background', '#2494f3');
                getCode.html("获取验证码");
            } else {
                curCount--;
                getCode.html(curCount + "秒后获取");
            }
        }, 1000);

        /*$.ajax({
            type: 'get',
            async: false,
            url: '/loginH5Api/getPhoneCode',
            data: {
                phone: $scope.PhoneNo,
                openId: $scope.openId
            },
            success: function (json) {
                var obj = JSON.parse(json);
                var message = obj.message;

                mui.alert(message, '&nbsp;', function() {
                    //
                });

                var getCode = $('#HA-getCode');

                var InterValObj;    //timer变量，控制时间
                var count = 60;     //间隔函数，1秒执行
                var curCount;       //当前剩余秒数

                curCount = count;

                //设置button效果，开始计时
                getCode.attr("disabled", "true");
                //getCode.css('background', '#cccccc').css('border', '1px solid #cccccc');

                getCode.html(curCount + "秒后获取");
                InterValObj = window.setInterval(function () {
                    if (curCount === 1) {
                        window.clearInterval(InterValObj);//停止计时器
                        getCode.removeAttr("disabled");//启用按钮
                        //getCode.css('background', '#2494f3');
                        getCode.html("获取验证码");
                    } else {
                        curCount--;
                        getCode.html(curCount + "秒后获取");
                    }
                }, 1000);

            },
            error:function (err) {
                mui.alert('服务器开小差了,请稍后重试', '&nbsp;', function() {
                    //
                });
                mui.hideLoading();
            }
        });*/

    };

    //注册提交
    $scope.submit = function () {
        if($scope.Name === ''){
            mui.alert('请填写姓名', '提示', function() {

            });
            return false;
        }

        if($scope.PhoneNo === ''){
            mui.alert('请填写手机号', '提示', function() {

            });
            return false;
        }

        if(!(common.isPhoneNo($scope.PhoneNo))){
            mui.alert('手机号格式有误', '提示', function() {

            });
            return false;
        }

        if($scope.IDCard === ''){
            mui.alert('请填写身份证号', '提示', function() {

            });
            return false;
        }

        if(!(common.isIdCardNo($scope.IDCard))){
            mui.alert('身份证格式有误', '提示', function() {

            });
            return false;
        }

        if($scope.QuestionVisit === false && $scope.BloodCollection === false){
            mui.alert('请至少选择问卷调查或血样采集', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === false && $scope.isAgent === false){
            mui.alert('请本人签名或代理人签名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isRelationship === true){
            mui.alert('本人签名后无需选择关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isInterviewed === true && $scope.isAgent === true){
            mui.alert('请只签一种名', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.isAgent === true && $scope.isRelationship === false){
            mui.alert('请选择与受访者关系', '提示', function() {
                $('.HA-register-informed').removeClass('signed').addClass('no-signed');
            });
            return false;
        }

        if($scope.Code === ''){
            mui.alert('请填写验证码', '提示', function() {

            });
            return false;
        }

    };

    /**
     * base64转blob
     * @param urlData
     * @returns {Blob}
     */
    $scope.toBlob = function (urlData) {
        var bytes = window.atob(urlData.split(',')[1]);
        // 去掉url的头，并转换为byte
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var  ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab],{type : 'image/jpeg'});
    };

    /**
     * 将base64转换为文件对象
     * @param dataurl
     * @param filename
     * @returns {File}
     */
    $scope.dataURLtoFile = function (dataurl, filename) {
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        //转换成file对象
        return new File([u8arr], filename, {type:mime});
        //转换成成blob对象
        //return new Blob([u8arr],{type:mime});
    };

    //初始化样式
    $scope.initCSS = function () {
        var navigation = $('.HA-navigation');
        var item = $('.HA-navigation-item');
        var arrow = $('.HA-navigation-arrow');
        var nWidth = navigation.innerWidth();
        item.css('width', ((nWidth*5)/23) + 'px');
        arrow.css('width', ((nWidth*1)/23) + 'px');

    };

    //弹出范例
    $scope.showTip = function () {
        var html = '<div class="pre-tip-show"></div>';
        mui.alert(html, '&nbsp;', function() {
            //
        });
    };

    /*******************************************************方法-end***********************************************************/

    /*******************************************************逻辑-start***********************************************************/
    //初始化数据
    $scope.INIT();

    //初始化样式
    $scope.initCSS();

    //获取当前时间
    $scope.getNowYear();

    //受访者写字板
    $scope.getInterviewed();

    //代理人写字板
    $scope.getAgent();

    /*******************************************************逻辑-end***********************************************************/

});