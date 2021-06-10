var fs = require('fs');
var robot = require("robotjs");

var names = [];
var breakOut = false;

function pause(long) {
	robot.setKeyboardDelay(long ? 200 : 40);
	robot.keyTap("shift");
}

function isWord(word) {
	return word.split('').every((char, i, a) => isLetter(char, i, word));
}

function isLetter(c, i, word) {
	if (c === "’") {
		word[i] === "'";
	}
	return c.toLowerCase() != c.toUpperCase() || c === "'";
}

function hasDoubleLetter(word) {
	return word.split("").some((v,i,a) => a.lastIndexOf(v) != i);
}

function typeName(name) {
	if (hasDoubleLetter(name)) {
		robot.typeStringDelayed(name, 10000);
	}
	else {
		robot.typeString(name);
	}
	
}

function stripPunctuation(name) {
	if (name[name.length - 1] === "\r") {
		name = name.substring(0, name.length - 1);
	}
	if (name[name.length - 1] === ",") {
		breakOut = true;
		if (name[name.length - 2] === ".") {
			return name.substring(0, name.length - 2);
		}
		return name.substring(0, name.length - 1);
	}
	else if (name[name.length - 1] === ".") {
		return name.substring(0, name.length - 1);
	}
	return name;
}

function capitalizeFirstLetter(word) {
	word = word.toLowerCase();
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function startTypingNames() {
	names.forEach(name => {
		typeName(name.last);
		robot.keyTap("tab");
		pause();
		typeName(name.first);
		if (name.prefix) {
			robot.keyTap("tab");
			pause();
			typeName(name.prefix);
			robot.keyTap("tab", "shift");
			pause();
		}
		robot.keyTap("right", "control");
		pause(true);
		robot.keyTap("tab", "shift");
		pause();
	});
}

var lastName = "";
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

		if (!words[0]) {
			return;
		}

		var currName = {};
		// Set the last name
		var lastChar = words[0][words[0].length];
		if (words[0][0] === '—' || words[0][0] === '~') {
			currName.last = lastName;
		}
		else if (lastChar === "." || lastChar === ",") {
			var strippedName = words[0].substring(0, words[0].length - 1);
			currName.last = strippedName;
			lastName = strippedName;
		}
		else {
			if (!isWord(words[0])) {
				return;
			}
			var namifiedName = capitalizeFirstLetter(words[0]);
			currName.last = namifiedName;
			lastName = namifiedName;
		}

		// Set the first name
		var firstName = "";
		// Check that it is capital and before the comma
		// sometimes there is no comma so we check for numbers or lowercase
		var i = 1;
		while (words[i] && words[i][0] && words[i][0] === words[i][0].toUpperCase()) {
			var name = words[i];

			// Handle common Prefixes
			if (name === "Mrs." || name === "Miss" || name === "Rev." || name === "Dr.") {
				currName.prefix = capitalizeFirstLetter(stripPunctuation(name));
				i++;
				continue;
			}

			if (!currName.prefix && i > 1 || i > 2) {
				firstName += " ";
			}
			// If it is an initial or has a comma, ignore that and go next
			name = stripPunctuation(name);
			if (!isWord(name)) {
				break;
			}
			firstName += capitalizeFirstLetter(name);
			if (breakOut) {
				breakOut = false;
				break;
			}
			i++;
		}
		currName.first = firstName;
		names.push(currName);
	})

	//console.log(names);
	console.log("getReady!!!");
	setTimeout (() => {
		startTypingNames();
	}, 2000)
	
} catch(e) {
	console.log('Error:', e.stack);
}
