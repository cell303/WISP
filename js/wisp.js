var $page, $weak, $icon, supports_local_storage, clockIntervals = [], pwIndex = 0, shift=false;

$(document).ready(function() {
	// check for localStorage support
	try {
		supports_local_storage = 'localStorage' in window && window['localStorage'] !== null;
	} catch(e) {
		supports_local_storage = false;
	}
});

$('.ui-page').live('pagecreate',function(event) {
	
	$weak = $('.weak');
	$icon = $('.icon');
	$page = $(this);
	
	// Resets the app
	reset();

	$page.find('.strong').bind('vclick',function() {
		$(this).selectText();
		document.execCommand('Copy');
	});

	$page.unbind('keydown').bind('keydown',function(e) {
		if($page.find('input:focus').length == 0) {
			if(e.keyCode == '27') {
				e.preventDefault();
				$page.find('.logo a').focus();
			}
			// j
			if(e.keyCode == '74') {
				e.preventDefault();
				pwIndex++; 
				if(pwIndex >= 8) pwIndex = 0;
				$strong = $page.find('.strong-'+pwIndex);
				
				var os = $strong.offset().top;
				var h = $(window).height()-100;
				if(os > h) {
					$(window).scrollTop(os - h);
				}

				if(pwIndex >= 2)
					$('.more .ui-collapsible-heading').trigger('expand');

				$strong.selectText();
				document.execCommand('Copy');
			}
			// k
			else if(e.keyCode == '75') {
				e.preventDefault();
				if(pwIndex <= 0) pwIndex = 8;
				pwIndex--;
				$strong = $page.find('.strong-'+pwIndex);

				var os = $strong.offset().top;
				var h = $(window).height()-100;
				if(os > h) {
					$(window).scrollTop(os - h);
				}

				if(pwIndex >= 3)
					$('.more .ui-collapsible-heading').trigger('expand');

				$strong.selectText();
				document.execCommand('Copy');
			}
			// shift
			else if(e.keyCode == '16') {
				shift = true;
			}
			// a
			else if(e.keyCode == '65' && shift == false) {
				e.preventDefault();
				var $t = $page.find('.chars-0');
				$t.attr('checked',!$t.attr('checked')).checkboxradio('refresh').trigger('change');
			}
			// A
			else if(e.keyCode == '65' && shift == true) {
				e.preventDefault();
				var $t = $page.find('.chars-1');
				$t.attr('checked',!$t.attr('checked')).checkboxradio('refresh').trigger('change');
			}
			// 1
			else if(e.keyCode == '49' && shift == false) {
				e.preventDefault();
				var $t = $page.find('.chars-2');
				$t.attr('checked',!$t.attr('checked')).checkboxradio('refresh').trigger('change');
			}
			// !
			else if(e.keyCode == '49' && shift == true) {
				e.preventDefault();
				var $t = $page.find('.chars-3');
				$t.attr('checked',!$t.attr('checked')).checkboxradio('refresh').trigger('change');
			}
			// h
			else if(e.keyCode == '72') {
				e.preventDefault();
				$c = $page.find('.length:checked');
				if($c.parents('.ui-radio').prev().length) {
					$page.find('.length').attr('checked',false).checkboxradio('refresh');
					$c.parents('.ui-radio').prev().find('.length').attr('checked',true).checkboxradio('refresh').trigger('change');
				}
			}
			// l
			else if(e.keyCode == '76') {
				e.preventDefault();
				$c = $page.find('.length:checked');
				if($c.parents('.ui-radio').next().length) {
					$page.find('.length').attr('checked',false).checkboxradio('refresh');
					$c.parents('.ui-radio').next().find('.length').attr('checked',true).checkboxradio('refresh').trigger('change');
				}
			}
			// x, d
			else if(e.keyCode == '88' || e.keyCode == '68') {
				e.preventDefault();
				reset();
			}
			// i
			else if(e.keyCode == '73') {
				e.preventDefault();
				$weak.focus();
			}
			// m
			else if(e.keyCode == '77') {
				$h = $page.find('.more .ui-collapsible-heading');
				if($h.hasClass('ui-collapsible-heading-collapsed'))
					$h.trigger('expand'); 
				else 
					$h.trigger('collapse');
			}
		}
	});		

	$page.unbind('keyup').bind('keyup',function(e) {
		shift = false;
	});
	
	// AJAX request by clicking on the lock
	$icon.bind('vclick', function() {
		var status = $icon.data('status'),
			weak = $weak.val();
		
		if(status == 'unlocked') {
			reset();
		}	
			
		else if(status != 'loading' && weak != '') {
			whisper(weak);
		}
	});
	
	// AJAX request by pressing enter
	$weak.bind('keydown', function(e) {
		var status = $icon.data('status'),
			weak = $weak.val();
			
		if( e.keyCode == '13' && status != 'loading' && weak != '') {
			clearIntervals();
			whisper(weak);
		}
	});
		
	// Change PW-length after loading
	$page.find('.length').bind('change', function() {
		if( !$page.find('.strong-0').data('v') )
			return
		var to, v;
		to = $page.find('.length:checked').val();
		$page.find('.strong').each(function() {
			v = $(this).data('v');
			$(this).html(v.substring(0,to));
		});
		$page.find('.strong-'+pwIndex).selectText();
		document.execCommand('Copy');
	});
	
	$page.find('.chars').bind('change', function() {
		weak = $weak.val();	
		if(weak != '') {
			clearIntervals();
			whisper(weak);
		}	
	});	
	
});

$('.ui-page').live('pagebeforeshow',function() {

	// Get active page 
	$page = $($.mobile.activePage);
	$weak = $page.find('.weak');
	$icon = $page.find('.icon');
	
	// Set default icon
	setStatus('locked');
	
	if(supports_local_storage) {
		
		// Set default values based on the settings
		if(localStorage['default-password'] != '') {
			$weak.val(localStorage['default-password']);
		}
		
		if(typeof localStorage['default-chars-0'] != 'undefined') {
			$page.find('.chars-0').attr('checked',localStorage['default-chars-0'] == 'true').checkboxradio('refresh');
			$page.find('.chars-1').attr('checked',localStorage['default-chars-1'] == 'true').checkboxradio('refresh');
			$page.find('.chars-2').attr('checked',localStorage['default-chars-2'] == 'true').checkboxradio('refresh');
			$page.find('.chars-3').attr('checked',localStorage['default-chars-3'] == 'true').checkboxradio('refresh'); 
		}	
		
		if(localStorage['default-length'] == 'true') {
			$page.find('.length-0').attr('checked',localStorage['default-length-0'] == 'true').checkboxradio('refresh'); 
			$page.find('.length-1').attr('checked',localStorage['default-length-1'] == 'true').checkboxradio('refresh'); 
			$page.find('.length-2').attr('checked',localStorage['default-length-2'] == 'true').checkboxradio('refresh');
		}
		
		// Auto retrieve password when enabled
		if(localStorage['auto-retrieve'] == 'true') {
			whisper($weak.val());	
		}
	}
	
	// Settings.html
	// Fix to show the slider disabled initially	
	$("#settings input[type='number']").css({opacity: 0.3}).slider('disable');
	
	if(supports_local_storage) {
		
		// Asks the user if this is his device before enabeling the settings
		$('#enable-settings').bind('change', function() {
			enableSettings($(this).is(':checked'));
			localStorage[$(this).attr('id')] = $(this).is(':checked');
		});
		
		// Display data if there is any stored in the localstorage
		if(localStorage['enable-settings'] == 'true') {
			$('#enable-settings').attr('checked',true).checkboxradio('refresh');
			enableSettings(true);
		}
	}
	else {
		// No Cookie support so far
		$('#enable-settings').attr('checked',false).checkboxradio('refresh');
	}
	
});

$('.ui-page').live('pageshow',function() {	
	// Fix - Sets focus on weak input
	setTimeout(function() {
		$weak.focus();
	},1);
});

// Enables storing data to localStorage
enableSettings = function(enable) {
	$settings = $('#settings');
	
	if(enable) {
		// Enable the input fields 
		$settings.find("input[type='password']").textinput('enable');
		$settings.find("input[type='number']").css({opacity: 1}).slider('enable');
		$settings.find("input[type='checkbox'], #settings input[type='radio']").checkboxradio('enable');
		
		// Set stored values
		$settings.find("input[type='password'], input[type='number']")
		.each(function() {
			if( typeof localStorage[$(this).attr('id')] != 'undefined' )
				$(this).val(localStorage[$(this).attr('id')]);
		});
			
		$settings.find("input[type='checkbox'], #settings input[type='radio']")
		.each(function() {
			if( typeof localStorage[$(this).attr('id')] != 'undefined' )
				$(this).attr('checked', localStorage[$(this).attr('id')] == 'true' ).checkboxradio('refresh');
		});
		
		// Set event handlers that store the settings in the localstorage
		$settings.find("input[type='password'], input[type='number']").bind('change', function() {
			localStorage[$(this).attr('id')] = $(this).val();
		});
		
		$settings.find("input[type='radio']").bind('change', function() {
			$(this).parents('.ui-controlgroup').find("input[type='radio']").each(function() {
				localStorage[$(this).attr('id')] = $(this).is(':checked');
			});
			localStorage[$(this).parents('.ui-controlgroup').attr('id')] = true;
		});
		
		$settings.find("input[type='checkbox']").bind('change', function() {
			localStorage[$(this).attr('id')] = $(this).is(':checked');
		});
		
		// Extra - Update checkbox text when slider moves
		/*$settings.find('#auto-hide-time').bind('change', function() {
			$settings.find('.auto-hide-time').html($(this).val());
		});*/
		
		// Save all default values to the localStorage
		$settings.find('input').trigger('change');
		
	}
	else {
		// Disalbe input fields, update visuals and unbind handlers
		$settings.find("input[type='password']").textinput('disable').unbind('change');
		$settings.find("input[type='number']").slider('disable').css({opacity: 0.3}).unbind('change');
		$settings.find("input[type='radio'], #settings input[type='checkbox']").checkboxradio('disable').unbind('change');
		
		// Delete all stored data
		localStorage.clear();
	}
}

// requests the strong passwords
whisper = function(weak) {
	if( $page.find('.i-agree').is(':checked') ) {
		
		setStatus('loading');
		
		options = JSON.stringify({
			'lowercase': $page.find('.chars-0').is(':checked'),
			'uppercase': $page.find('.chars-1').is(':checked'),
			'digits': $page.find('.chars-2').is(':checked'),
			'special': $page.find('.chars-3').is(':checked')
		});
		
		// Request the passwords from the server
		$.ajax({
			type: "POST",
			url: "/whisper",
			data: "weak="+weak+'&options='+options,
			success: function(data) {
				setStatus('unlocked');
				showPasswords(data);
			},
			error: function() {
				reset();
			}
		});
	}
};

// takes an array of 6 passwords and displays them for 60 sec
showPasswords = function(data) {
	var s, to, _i, _len, $clock;
	to = $page.find(".length:checked").val();
	
	// Insert passwords into the DOM
	for (_i = 0, _len = data.length; _i < _len; _i++) {
		s = data[_i];
		$page.find('.strong-'+_i).removeClass('strong-placeholder').data('v',s).html(s.substring(0,to));
	}
	
	$page.find('.logo a').focus();
	$page.find('.strong-'+pwIndex).selectText();
	document.execCommand('Copy');

	// Automatically remove password after 60 sec to prevent abuse
	$clock = $page.find('.clock');
	
	// Use settings or default values
	if(supports_local_storage && typeof localStorage['auto-hide'] != 'undefined') {
		if( localStorage['auto-hide'] == 'true' ) {
			if( typeof localStorage['auto-hide-time'] != 'undefined' ) {
				_len = localStorage['auto-hide-time'];
			}
		}
		else {
			// auto-hide turned off 
			return
		}
	}
	// autohide disabled
	else {
		_len = 60;
	}
	
	_i = _len;
	$clock.html(_i);
	
	// The interval id added to an array just to be sure that no id gets lost						
	clockIntervals.push( setInterval(function() {
		_i--;
		$clock.html(_i);
		
		// Show the clock after half of the time has passed
		if(_i == _len/2) {
			$clock.show().siblings().hide();
		}
		
		// Lock the app and clear the interval when the time is over
		if(_i <= 0) {
			reset();
		}
	},1000));

};

// Remove all password data from the DOM
reset = function() {
	
	// Display the default icon
	setStatus('locked');
	
	// Stop counting down
	clearIntervals();
	
	$weak.val('');
	$('.strong').each(function() {
		$(this).addClass('strong-placeholder').data('v','').html($(this).data('placeholder'));
	});
	
	pwIndex = 0;

	$weak.focus();
};

// Clear all intervals in the array (should be just one)
clearIntervals = function() {
	var interval = clockIntervals.pop();
	while(typeof interval != 'undefined' ) {
		clearInterval(interval);
		interval = clockIntervals.pop();
	}
}

// Handles visual feedback on the icon
setStatus = function(status) {
	if(status == 'locked') {
		$icon.data('status','locked').children().hide().filter('.locked').show().addClass('pointer');
	}
	else if(status == 'loading') {
		$icon.data('status','loading').children().hide().filter('.loading').show().removeClass('pointer');
	}
	else if(status == 'unlocked') {
		$icon.data('status','unlocked').children().hide().filter('.unlocked').show().addClass('pointer');
	}
};
	
jQuery.fn.selectText = function(){
    var doc = document;
    var element = this[0];
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.setBaseAndExtent) {
            selection.setBaseAndExtent(element, 0, element, 1);
        } else {
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(element);
        }
    }
};
