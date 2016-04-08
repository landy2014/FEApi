$(function() {
    // 编辑
    $(document).on("click", ".j_edit", function(e) {
        var name = $(this).attr("data-name");
        var id   = $(this).attr("data-id");

        window.location.href = "/api/edit?id=" + id + "&name=" + name;
    });
    // 删除 
    $(document).on("click", ".j_del", function(e) {
        if (confirm("是否要删除这条记录？")) {
            $.ajax({
                url: "/api/delApi",
                data: {
                    id: $(this).attr("data-id"),
                    name : $(this).attr("data-name")
                },
                success: function(result) {
                    if (result.status === "succ") {
                        window.location.href = window.location.href;
                    } else {
                        alert("删除失败！");
                    }
                }
            });
        }
    });
});
