<?php
  $_POST = json_decode(file_get_contents("php://input"),true);
$fp = fopen('../dir.js', 'w');
fwrite($fp, 'DATA='.$_POST['DATA'].';'.PHP_EOL .'DATAf='.$_POST['DATAf'].';'.PHP_EOL .'DATAd='.$_POST['DATAd'].';');
fclose($fp);
echo "done";
  ?>