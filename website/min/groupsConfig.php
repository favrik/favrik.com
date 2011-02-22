<?php
/**
 * Groups configuration for default Minify implementation
 * @package Minify
 */

/** 
 * You may wish to use the Minify URI Builder app to suggest
 * changes. http://yourdomain/min/builder/
 **/

class grc {
    private $array;
    private $base;
    private $key;

    function k($k) {
        $this->key = $k;

        return $this;
    }

    function b($b) {
        $this->base = $b;

        return $this;
    }

    function a($a) {
        $this->array[$this->key][] = '//' . $this->base . $a;

        return $this;
    }

    function o($o) {
        $this->array[$this->key][] = '//' . $o;
        return $this;
    }

    function g() {
        return $this->array;
    }
}

$g = new grc();

$a = $g->k('js')->b('scripts/jquery/')
  ->a('jquery-1.3.2.js')
  ->a('jquery-dom.js')
  ->a('jquery.json-1.3.min.js')
  ->o('scripts/swfobject/swfobject.js')
  //->o('projects/syncotype/syncotype.js')
  ->b('projects/yu/yuplay/')
  ->a('player.js')
  ->a('playlist.js')
  ->a('search.js')
  ->a('search_results.js')
  ->a('utils.js')
  ->a('yuplay.js')
  ->k('css')->o('projects/yu/yuplay.css')
  ->g();

return $a;
//print_r($a);
//echo 'hi';
/*
return array(
    'js' => array(
        '//scripts/jquery/file1.js', 
        '//js/file2.js'
     ),
    'css' => array('//css/file1.css', '//css/file2.css'),
);
*/
