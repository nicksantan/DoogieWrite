<?php
error_reporting(E_ALL);
$txt = $_GET["txt"];
$txt_new = stripslashes($txt);

header("Status: 200");
header("Content-type: application/doogiewrite");
header("Content-Disposition:attachment; filename=\"my_text_file.txt\"");

echo $txt_new;

exit();
?>