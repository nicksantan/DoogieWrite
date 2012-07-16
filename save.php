<?php
error_reporting(E_ALL);
$txt = $_POST["txt"];
$txt_new = stripslashes($txt);
$test = "woah";
$fn = "tmp" . md5(microtime()) . ".txt";
$file = fopen($fn, "w");
fwrite($file, $txt_new);
fclose($file);
sleep(1);
header("Status: 200");
echo $fn;
//header("Location: /tmpe5cc21f13caf80b1bc1a9e9562c0b424.txt");
exit();
?>