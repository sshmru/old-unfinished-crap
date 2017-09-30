$(function(){
	$('.killbtn').on('click', function(){
		var item = $(this).parent();
		var itemid = item.attr('id');
		item.hide();
			$.ajax({
				type: "DELETE",
				url: '/mydb/' + itemid,
			});
	});
	
	var rmv = $('#rmv');
    rmv.submit(function (ev) {
        $.ajax({
			type: rmv.attr('method'),
			processData: false,
            url: rmv.attr('action') + $('#rmvid').val(),
			success: function(data){
			}			
        });
        ev.preventDefault();
    });
	var add = $('#rmv');
    add.submit(function (ev) {
        $.ajax({
			type: add.attr('method'),
            url: add.attr('action'),
			data: add.serialize(),
			crossDomain: true,
			dataType: 'jsonp',
            contentType: "application/json",
        }).success(function(data){
			console.log(data);
		});
        ev.preventDefault();
    });

});