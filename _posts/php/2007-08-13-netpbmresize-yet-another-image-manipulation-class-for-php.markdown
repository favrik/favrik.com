--- 
wordpress_id: 13
layout: post
title: NetpbmResize yet another Image manipulation class for PHP
wordpress_url: http://blog.favrik.com/2007/08/13/netpbmresize-yet-another-image-manipulation-class-for-php/
category: [php]
---
This is a shameless plug, if you are in need of an image resizing solution in PHP, you could try <a href="http://netpbmresize.sourceforge.net">NetpbmResize</a>. It uses <a href="http://netpbm.sourceforge.net">NetPBM</a> for resizing images. And since binaries for windows and linux are <a href="http://tinyurl.com/25daoc">available</a> it's just a matter of uploading them and start resizing. (^-^)y



## Things you should know
<a href="http://www.baschny.de/graphic-test/">Apparently</a>, ImageMagick has outstanding performance when resizing images compared to GD and NetPBM,  so that should be your first choice.

## Image manipulation alternatives
With so much classes, libraries and packages that provide image manipulation, I wonder why did I code this.  My main reason was the interface, and secondly, learning and applying OOP in php.

Code that I checked and already does this: <a href="http://www.codeigniter.com/user_guide/libraries/image_lib.html">Code Igniter Image lib</a>, <a href="http://ez.no/doc/components/view/latest/(file)/introduction_ImageConversion.html#id7">ezNo ImageConversion</a>.

<a href="http://www.hotscripts.com/PHP/Scripts_and_Programs/Image_Handling/Image_Manipulation/index.html">And that is</a> the beauty and horror of PHP software. 
[1]: http://netpbmresize.sourceforge.net "NetpbmResize"
