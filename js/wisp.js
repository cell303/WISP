var $page, $weak, $icon, clockIntervals = [];
	
$('.ui-page').live('pagecreate',function(event) {
	
	$weak = $('.weak');
	$icon = $('.icon');
	$page = $(this);
	
	// Resets the app
	reset();
		
	// Hide the "More..."-Button after it has been clicked
	$('.more').bind('vclick', function() {
		$(this).find('h3').hide();
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
			
		if( e.keyCode == '13' && status != 'loading') {
			clearIntervals();
			whisper(weak);
		}
	});
		
	// Change PW-length after loading
	$page.find('.length').bind('change', function() {
		if( !$page.find('.strong-1').data('v') )
			return
		var to, v;
		to = $page.find('.length:checked').val();
		$page.find('.strong').each(function() {
			v = $(this).data('v');
			$(this).html(v.substring(0,to));
		});
	});
	
	// Asks the user if this is his device before enabeling the settings
	$('#enable-settings').bind('change', function() {
		enableSettings($(this).is(':checked'));
		localStorage[$(this).attr('id')] = $(this).is(':checked');
	});
});

$('.ui-page').live('pagebeforeshow',function() {

	// Get active page 
	$page = $($.mobile.activePage);
	$weak = $page.find('.weak');
	$icon = $page.find('.icon');
	
	// Set default icon
	setStatus('locked');
	
	// Set default values based on the settings
	if(localStorage['default-password'] != '') {
		$weak.val(localStorage['default-password']);
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
	
	// Settings.html
	// Fix to show the slider disabled initially
	$("#settings input[type='number']").css({opacity: 0.3}).slider('disable');
	
	// Display data if there is any stored in the localstorage
	if(localStorage['enable-settings'] == 'true') {
		$('#enable-settings').attr('checked',true).checkboxradio('refresh');
		enableSettings(true);
	}	
	
});

$('.ui-page').live('pageshow',function() {	
	// Fix - Sets focus on weak input
	setTimeout(function() {
		$weak.focus();
	},1);
	
	//gapi.plusone.go();
	
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
		$settings.find('#auto-hide-time').bind('change', function() {
			$settings.find('.auto-hide-time').html($(this).val());
		});
		
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
		// Request the passwords from the server
		$.ajax({
			type: "POST",
			url: "/whisper",
			data: "weak="+weak,
			success: function(data) {
				showPasswords(data);
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
	setStatus('unlocked');
	
	// Automatically remove password after 60 sec to prevent abuse
	$clock = $page.find('.clock');
	
	// Use settings or default values
	if( typeof localStorage['auto-hide'] != 'undefined' ) {
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
	
	$('.weak').val('');
	$('.strong').each(function() {
		$(this).addClass('strong-placeholder').data('v','').html($(this).data('placeholder'));
	});
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
	

