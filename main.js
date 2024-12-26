/**
 * @see https://browsersync.io/
 * @see https://browsersync.io/docs
 * @see https://browsersync.io/docs/options
 */
const
	fs = require('node:fs'),
	browserSync = require('browser-sync').create(),
	pages = 'src/pages',
	index = 'index.html',
	start = `${pages}/${index}`,
	fallback = `${pages}/en/${index}`

// Synchronise the main index.html with the fallback English version.
// @see https://nodejs.org/docs/latest/api/fs.html#fswatchfilename-options-listener
const copy = () => fs.copyFile(
	start,
	fallback,
	error => {
		if (error) throw error
		console.log(`'${start}' was copied to '${fallback}'`)
	}
)
let timeout = null //Used to prevent multiple changes
fs.watch(
	start,
	() => {
		clearTimeout(timeout)	// Reset the timeout to prevent multiple changes
		timeout = setTimeout(copy, 1000)
	}
)
copy()

/**
 * This example will serve files from the './app' directory
 * and will automatically watch for html/css/js changes
 */
browserSync.init({
	watch: true,
	serveStatic: ['.', './public', './src', `./${pages}`],
	server: {
		baseDir: '.',
		index: start,
	},
	ignore: [
		'.vscode/**',
		'builds/**',
		'node_modules/**',
		'main*.js',
		'package.*json',
		'*.md',
		'*.less',
		'*.css.map',
	],
	// port: 9013, // Using a custom port leads to an unpleasant delay between switches
	// cwd: '.',
	logPrefix: 'Proprietyon',
	// reloadDelay: delay * 2,
	// startPath: ''
	// localOnly: true,
})
// browserSync.watch(['**/*.*'], { ignored: '*.less' })