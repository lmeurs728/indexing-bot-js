var fs = require('fs');
var robot = require("robotjs");

var names = [];

function startTypingNames() {
	names.forEach(name => {
		robot.setKeyboardDelay(10);
		robot.typeString(name.last);
		robot.keyTap("tab");
		robot.typeString(name.first);
		robot.setKeyboardDelay(251);
		robot.keyTap("pagedown");
	})
}

try {  
    var data = fs.readFileSync('input.txt', 'utf8');
	// console.log(data.toString());
	var lines = data.split("\n");
	
	lines.forEach(line => {
		line.trim();
		// If it is corrupt or not a name, skip it
		if (line[0] && (line[0] !== line[0].toUpperCase() || line[0] === "\r")) {
			return;
		}

		var words = line.split(" ");

		var currName = {};
		// Set the last name
		currName.last = words[0];

		// Set the first name
		var firstName = "";
		// Check that it is capital and before the comma
		// sometimes there is no comma so we check for numbers or lowercase
		var i = 1;
		while (words[i] && words[i][0] && words[i][0] === words[i][0].toUpperCase()) {
			if (i > 1) {
				firstName += " ";
			}
			// If it is an initial or has a comma, ignore that and go next
			if (words[i][words[i].length - 1] === ",") {
				firstName += words[i].substring(0, words[i].length - 1);
				break;
			}
			else if (words[i][words[i].length - 1] === ".") {
				firstName += words[i].substring(0, words[i].length - 1);
			}
			else {
				firstName += words[i];
			}
			i++;
		}
		currName.first = firstName;
		names.push(currName);
	})

	console.log("getReady!!!");
	setTimeout (() => {
		startTypingNames();
	}, 5000)
	
} catch(e) {
	console.log('Error:', e.stack);
}
