(function () {
	'use strict';
	var fs = require('fs'),
		_ = require('lodash'),
		tasks = [],
		uniqueTasks = [],
		audioJSON = [],
		outputFilename = 'audio.json',
		idCounter = 9993;

	fs.readdir('./audio/', function (err, files) {
		// Get uniq tasks
		_.each(files, function (item, i) {
			var parsed = files[i].split('-'),
				task = parsed[0];

			tasks.push(task);
		});

		uniqueTasks = _.unique(tasks);

		// Task loop
		for (var k = 0; k < uniqueTasks.length; k++) {
			audioJSON.push({
				'id': idCounter,
				'title': 'Говорение',
				'time': 300,
				'tasksInSession': 1,
				'passingScore': 100,
				'description': 'Просто говорите на русском и все будет хорошо.',
				'isValid': true,
				'tasks': [{
					'id': 1,
					'type': 'speak',
					'trial': true,
					'title': 'Прослушайте диалог и попробуйте запомнить его содержание',
					'text': 'После прослушивания диалога вам будет предложено принять участие в роли одной из сторон.',
					'audioTask': [],
					'images': [],
					'answers': [],
					'validAnswers': []
				}]
			});
			idCounter++;

			// Dialogs loop
			for (var i = 0; i < files.length; i++) {
				var parsed = files[i].split('-'),
					task = parsed[0],
					dialog = parsed[1],
					person = parsed[2].split('.')[0];

				if (task == uniqueTasks[k]) {
					var odd = i,
						even = i + 1;

					if (files[even]) {
						if (task === files[even].split('-')[0]) {
							if (dialog % 2) {
								audioJSON[k].tasks[0].audioTask.push({
									speaker1: files[odd],
									speaker2: files[even]
								});
							}
						} else {
							if (dialog % 2) {
								audioJSON[k].tasks[0].audioTask.push({
									speaker1: files[odd]
								});
							}
						}
					}
				}
			}
		}

		writeJSON(audioJSON);
	});

	function writeJSON(data) {
		fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('JSON saved to ' + outputFilename);
			}
		});
	}

})();
