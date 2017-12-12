// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

function confirmModal(options) {
    options = $.extend({
        title: 'Confirm',
        content: 'Are you sure?',
	    confirmButtonText: 'Confirm',
	    cancelButton: true,
	    cancelButtonText: 'Cancel',
        confirmButtonClick: function(e) {
            var modalDialog = e.data;
            modalDialog.modal('hide');
            modalDialog.on('hidden.bs.modal', function() {
               $(this).remove();
            });
            options.confirmCallback();
        },
        confirmCallback: function() {

        }
    }, options);
    var modalDialog = $('<div/>').addClass('modal fade').appendTo('body');
    var dialog = $('<div/>').addClass('modal-dialog').appendTo(modalDialog);
    var content = $('<div/>').addClass('modal-content').appendTo(dialog);
	var header = $('<div/>').addClass('modal-header').appendTo(content);
	$('<h5/>').addClass('modal-title').html(options['title']).appendTo(header);
	$('<button/>').attr('type', 'button').addClass('close').attr('data-dismiss', 'modal').html('<span aria-hidden="true">&times;</span>')
        .appendTo(header);
	$('<div/>').addClass('modal-body').html(options['content']).appendTo(content);
	var footer = $('<div/>').addClass('modal-footer').appendTo(content);
	$('<button/>').attr('type', 'button').addClass('btn btn-primary').html(options['confirmButtonText'])
		.appendTo(footer).on('click', modalDialog, options['confirmButtonClick']);
	if (options.cancelButton)
		$('<button/>').attr('type', 'button').addClass('btn btn-secondary').attr('data-dismiss', 'modal')
			.html(options['cancelButtonText'])
			.appendTo(footer);
	modalDialog.modal();
}
