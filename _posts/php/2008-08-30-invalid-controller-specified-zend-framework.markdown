--- 
layout: post
title: Invalid controller specified - Zend Framework
meta_description: A possible common error when starting with Zend Framework, that can be solved by understanding the framework conventions
meta_keywords: invalid controller specified, zend framework, conventions
category: [php]
---
I just lost some time doing the WTF dance, so I'm taking a few minutes to make this note for future reference. Also, because I have a very fragile memory.

One of the common errors that new users of ZF get, is the "Invalid controller specified" error. Which means exactly that. But what happens when you did make sure that you setup the controller directory, and you created the controller in that place?

The answer is a question: are you following the ZF Controller naming conventions?

Here they are for your enjoyment:

For a controller to be resolvable, its filename must be in the following format:

XxxxxxxxController.php

where "X" represents any capitalized letter, and "x" any lowercase letter.

So, let's say you have a controller that provides SOAP functionality: you can't name it SOAPController.php, you must name it SoapController.php. A very small difference to have in mind that can save you from multiple WTFs. This information refers only to filenames. Not the class names that are in the code.

Hopefully, by doing this little post, this knowledge has been imprinted on my brain. I have my doubts.
