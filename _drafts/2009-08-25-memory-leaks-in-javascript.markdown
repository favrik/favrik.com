---
layout: post
title: Memory leaks in Javascript
meta_description: 
meta_keywords: 
---
If you go beyond simple Javascript usage, memory leaks will be one of you major headaches. And very painful ones. XD  This is a personal post from my programming perspective on how to deal with them. So take it with a grain of salt.

I believe for most people leaks will be unexpected.  You won't be thinking about them when coding your awesome full Javascript application. And that means you won't be in a position to prevent them.  So I will divide this article in two parts: 1) Solving Javascript memory leaks, and 2) Preventing Javascript memory leaks. Let's begin.

## Solving Javascript memory leaks

In order to solve any problem, you must first understand it.  Unfortunately, the majority of internet articles about memory leaks in Javascript show ridiculously simplified examples. 

Leaks have two possible sources:

* 


### Relevant information on the internets

http://www.ibm.com/developerworks/web/library/wa-memleak/
http://msdn.microsoft.com/en-us/library/bb250448(VS.85).aspx
http://www.crockford.com/javascript/memory/leak.html
http://www.nabble.com/Blank-jQuery-page-leaks-memory-in-IE--td23079501s27240.html
http://groups.google.com/group/comp.lang.javascript/msg/aa56d57c625b404c
http://groups.google.com/group/comp.lang.javascript/browse_frm/thread/9ba20706f3b3fc73/aa56d57c625b404c#aa56d57c625b404c
