<?php
/*$del= explode(".\\", file_get_contents("../../corner/del/del.txt"));
echo count($del)-1;*/
	/*$original = array( 'a', 'b', 'c', 'd', 'e' );
$inserted = 'x' ; // not necessarily an array, see manual quote
 
array_splice( $original, 3, 0, $inserted );
var_dump($original);
echo "<br/>";

$str="DATA=[1,2,3];\nDATAf=[1,2];\nDATAd=[1,3];";
echo $str."<br/><br/>";
$array = explode("\n", file_get_contents("dir.js"));
$array[0]=str_replace(";","",$array[0]);
$array[0]=str_replace("DATA=","",$array[0]);
$arr1=json_decode($array[0]);
$array[1]=str_replace(";","",$array[1]);
$array[1]=str_replace("DATAf=","",$array[1]);
$arr2=json_decode($array[1]);
$array[2]=str_replace(";","",$array[2]);
$array[2]=str_replace("DATAd=","",$array[2]);
$arr3=json_decode($array[2]);

echo $array[1] ."<br/>";
$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
$txt = $arr2[0];
fwrite($myfile, $txt);

fclose($myfile);*/
?>