var robot = require("robotjs");

setTimeout (() => {
	robot.keyTap('tab', 'shift');
	for (var i = 0; i < 6; i++) {
		robot.keyTap('tab');
		robot.keyTap('backspace');
		robot.keyTap('d', ['alt', 'shift']);
	}
}, 2000)

