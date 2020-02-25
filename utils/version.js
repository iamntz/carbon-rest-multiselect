const replace = require('replace');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));

replace({
	regex: '(CARBON_REST_MULTISELECT_VERSION\', \')(\\d+\\.\\d+\\.\\d+)',
	replacement: '$1' + pkg.version,
	paths: ['init.php'],
	recursive: false,
	silent: true,
});
