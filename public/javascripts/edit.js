$(function(){
	var tipDialog = new dialog({

	});

	$(document).on("click", ".j_save", function(e){

		var id = $("input[name=id]").val();
		var name = $("input[name=name]").val();
		var rules = $("textarea[name=rules]").val();
		var method = $("select[name=method]").val();
		var sumary = $("textarea[name=sumary]").val();

		$.ajax({
			url : "/api/saveEdit",
			data : {
				"id" : id,
				"name" : name,
				"rules" : rules,
				"method" : method,
				"sumary" : sumary
			},
			success : function(result) {
				if(result.status=="succ") {
					alert("更新成功！");
					window.location.href = "/api/list";
				} else {
					alert(result.msg);
				}
			}
		})
	});




});