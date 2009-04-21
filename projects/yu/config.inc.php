<?php
$path = realpath('../../min/lib');
set_include_path(get_include_path() . PATH_SEPARATOR . $path);
$path = realpath('../../');
set_include_path(get_include_path() . PATH_SEPARATOR . $path);

require 'min/utils.php';
$jsUri  = Minify_groupUri('js');
$cssUri = Minify_groupUri('css');

$wp = '/projects/yu/';

