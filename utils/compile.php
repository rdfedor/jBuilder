#!C:\Users\rfedor\Documents\Projects\xampp\php\php.exe -q
<?PHP

echo "--=== jBuilder Project Minifier ===--\r\n\r\n";

$trunkDir = "../trunk/";
$outputDir = "output/";
$outputFile = "jquery.jBuilder.js";
$minOutputFile = "jquery.jBuilder.min.js";

$start = time();
$startStr = date("H:i:s",$start);
echo <<<eof
trunkDir = "{$trunkDir}"
outputDir = "{$outputDir}"
outputFile = "{$outputFile}"
minOutputFile = "{$minOutputFile}"

Started {$startStr}

eof;

$files = array(
	'core.js',
    'window.js',
	'util/defaultPluginFunctions.js',
	'util/uid.js',
	'util/filter.js',
    'util/events.js',
    'util/mousewheel.js',
    'util/scrollBar.js',
    'util/validate.js',
	'content/html.js',
    'content/panel.js',
	'layout/accordion.js',
	'layout/tab.js',
	'form/panel.js',
	'form/field/button.js',
	'form/field/textfield.js',
	'form/field/password.js',
    'form/field/datefield.js',
	'form/field/checkbox.js',
	'form/field/label.js',
	'form/field/radiogroup.js',
	'form/field/select.js'
	);

$fileContents = "";
foreach ($files as $file) {
	echo "Reading {$file}...\r\n";
	$fileContents .= file_get_contents($trunkDir . $file) . "\r\n";
}

echo "Storing combined file to {$outputFile}...\r\n";
file_put_contents($outputDir . $outputFile, $fileContents);

echo "Minifying to {$minOutputFile}....\r\n";
echo shell_exec("\"bin/node.exe\" \"bin/uglify-js/bin/uglifyjs\" -c -o \"{$outputDir}/{$minOutputFile}\" \"{$outputDir}/{$outputFile}\"");

$end = time();
$endStr = date("H:i:s",$start);
$dur = round(($end - $start) / 60);

echo <<<eof
Script completed...
Duration : {$dur} sec
Ended : {$endStr}
eof;

?>