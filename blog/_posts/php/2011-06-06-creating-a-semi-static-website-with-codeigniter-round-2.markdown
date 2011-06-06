---
layout: post
title: Creating a semi-static website with CodeIgniter ROUND 2
meta_description: A follow up for my previous post about same topic, creating static websites with CodeIgniter
meta_keywords: CodeIgniter, codeigniter-reactor, static website, simple website
category: ['web-development', 'php']
---

I'm a bit late with this article (just about 4 months xD).

The use case for a site like this is very limited and I don't think it's very common, but here's another way to use CodeIgniter for a static website.  This article builds upon the previous related article [Creating a semi-static website with CodeIgniter](http://blog.favrik.com/2010/05/19/creating-a-semi-static-websites-with-codeigniter/).

## 1. The controller
With this approach, we would use another controller: <code>applications/controllers/staticx.php</code>

<script src="https://gist.github.com/1010076.js"> </script>


## 2. The configuration
And a different configuration for the <code>application/config/routes.php</code> file.

<script src="https://gist.github.com/1010079.js"> </script>


## 3. A common layout

Almost finally, for this to work, a file named <code>layout.php</code> must exist inside the <code>application/views/</code> directory.

A quick example:
<script src="https://gist.github.com/1010080.js"> </script>



## 4. Adding a page

Now, adding a new page to your static site is just a matter of creating the view file inside the <code>application/views/</code> directory.

#### Examples:  

If you request <code>example.com/about</code>, the controller will look for the file <code>application/views/about.php</code>

If you request <code>example.com/products/electronics</code>, the controller will look for the file in <code>application/views/products/electronics.php</code>.

So to summarize:

<table>
    <tr>
        <th>Request</th><th>View file to be rendered</th>
    </tr>
    <tr
        <td>example.com/about</td>
        <td>application/views/about.php</td>
    </tr>

    <tr>
        <td>example.com/products/electronics</td>
        <td>application/views/products/electronics.php</td>
    </tr>

</table>

The following is an example view file:
<script src="https://gist.github.com/1010090.js"> </script>

You can notice some PHP comments at the beginning of the file.  The controller parses those comments and converts them into variables that can be used in your <code>application/views.layout.php</code> file.   You could modify the controller to include more variables (see <code>get_available_page_data()</code>).  This is definitely not very optimized. But I think it can work for simple static websites which are not very common nowadays. :)

