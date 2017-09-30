$(function(){
	var focus = function(target){
		focused = target;
		focused.addClass('highlighted');
	};
	var unfocus = function(target){
		focused = 0;
		target.removeClass('highlighted');
	};
	var focused = 0;

	document.oncontextmenu = function() {return false;};
	
	$('.slot').hover( function() {
			$( this ).addClass('red');
		}, function() {
			$( this ).removeClass('red');
		}
	);
	$(document).mousedown(function(e){ 
		var tgt = $(e.target);
		if(tgt.attr('id') === 'showme'){
			if( e.button === 2 ) { 
				$('#showme').css('visibility', 'hidden');
				return false; 
			} 
		}
		else if(tgt.hasClass('slot')){
			if( e.button === 2 ) { 
				$('#showme').css('visibility', 'visible');
				return false; 
			} 
			else if( e.button === 0 ) { 
				if(focused === 0){
					focus(tgt);
				}
				else if(focused.is(tgt)){
					unfocus(tgt);
				}
				else if(tgt.attr('cardid')==='null'){
					var temp = focused;
					$.post('/game/move/' + focused.parent().attr('id') 
					+ '/' + focused.attr('slotnr') 
					+ '/' + tgt.parent().attr('id')  
					+ '/' + tgt.attr('slotnr'), function(res){
						tgt.html('<p>' + JSON.stringify(res.name) + '</p>');
						temp.html('<p> empty</p>');
					});	
					unfocus(focused);
				}
				return false; 
			} 
		}
		return true; 
	}); 
	$('div').on('click', function(){
		if($(this).is($('#turn'))){
			$.post('/game/turn', function(res){
				alert(res);
			});
		}else if($(this).is($('#count'))){
			$.post('/mydb/count', function(res){
				alert(res);
			});
		}else if($(this).is($('#exit'))){
			$.get('/game/exit', function(res){
				window.location.replace("/");
			});
		}else if($(this).is($('#lel'))){
			$.get('/game/exit', function(res){
				document.open();
				document.write(res);
				document.close();
			});
		}
	});
	

});