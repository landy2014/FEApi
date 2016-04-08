$(function() {

    var d = new dialog({
        title: "提示",
        width: 320,
        height: 100,
        button: [{
            value: "好的",
            callback: function() {
                d.close();
                return false;
            }
        }]
    });

    // 保存按钮事件
    $(document).on("click", ".j_save", function(e) {
        var apiData = {};

        var apiName = $("input[name=name]").val();
        var apiRules = $("textarea[name=rules]").val();
        var apiMethod = $("select[name=method]").val();
        var apiSumary = $("textarea[name=sumary]").val();

        // 判断接口名称        
        if (isEmpty(apiName) && !chkName(apiName)) {
            d.content("API接口名称不能为空！<br> 而且只能是3-12位的英文字符！");
            d.showModal();
            return false;
        }
        // 暂存数据
        apiData["apiName"] = apiName;
        apiData["apiMethod"] = apiMethod;

        // 判断接口规则
        if (isEmpty(apiRules)) {
            d.content("API规则不能为空！");
            d.showModal();
            return false;
        } else if(!chkRules(apiRules)){
            d.content("API规则必须以 { 开头并且以 } 结尾！");
            d.showModal();
            return false;
        }

        // 暂存数据
        apiData["apiRules"] = apiRules;

        apiData["apiSumary"] = apiSumary;

        // 插入数据库
        saveApi(apiData);


    });
    /**
     * 发出ajax 保存表单
     * @param 
     * @return {[type]} [description]
     */
    function saveApi(apiData) {
        var tipDialog = new dialog({
            content : "保存成功！"
        });
        // 异步插入数据
        $.ajax({
            url: "/api/saveApi",
            data: {
                "name": apiData.apiName,
                "rules": apiData.apiRules,
                "method": apiData.apiMethod,
                "sumary" : apiData.apiSumary
            },
            success: function(result) {
                if (result.status === "succ") {
                    // 提示成功
                    tipDialog.show();
                    // 定时关闭提示窗
                    setTimeout(function(){
                        location.href = window.location.href;
                    },1000);
                    
                } else {
                    // 提示失败
                    tipDialog.content('<span class="text-error">保存失败！</span>');
                    tipDialog.show();
                    // 定时关闭提示窗
                    setTimeout(function(){
                        tipDialog.close();
                    },1000);
                }
            }
        });
    }
    /**
     * 检查API 名字格式
     * @param  string str 待检查字符串
     * @return boolean  true/false
     */
    function chkName(str) {
        var reg = /^[a-zA-Z]{3,12}$/g;
        return reg.test(str);
    }
    /**
     * 
     */
    function chkRules(str) {
        var reg = /^{[\s|\S\s*]*}$/g;
        return reg.test(str);
    }

    /**
     * 判断字符串是否为空
     * @param  {[type]}  str [description]
     * @return {Boolean}     [description]
     */
    function isEmpty(str) {
        console.log(!$.trim(str).length);
        return !$.trim(str).length;
    }
});
