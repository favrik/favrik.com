---
layout: post
title: Learning Google Checkout and the Notification API
meta_description: learning google checkout with a quick flow implementation using PHP
meta_keywords: learning, PHP, google, google checkout, buyer merchant flow 
category: ['web-development']
---
This is geared to the seasoned developer, and it provides only the basics for starting a complex Google Checkout integration. So, let's begin:


## Reading Material

<ul>
<li><a href="http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#integration_overview">Integration overview</a></li>
<li><a href="http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api">Checkout API</a></li>
<li><a href="http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Notification_API.html">New order notifications</a></li>
</ul>


## The Setup

It has to be done in the sandbox, when everything goes fine, you just switch to production (easy to write). Note: when creating the following accounts you can use a test credit card number like: 4111111111111111, 6011111111111117, or 5555555555554444. First, <a href="https://sandbox.google.com/checkout/sell/">create a seller account</a> and then <a href="https://sandbox.google.com/checkout/">create a buyer account</a>. Then make sure to grab the merchant ID and merchant Key from <a href="https://sandbox.google.com/checkout/sell/settings?section=Integration">the Integration Section on your Google Checkout dashboard</a>.

<h2>The product page</h2>

<p>Now, create a &#8220;Buy now&#8221; button via the Tools section <a href="https://sandbox.google.com/checkout/sell2/settings?section=BuyNowButton">here</a>.  Important note: you can create your own &#8220;Buy Now&#8221; buttons programmatically via the Checkout API.  Then paste the code in your product page.  <a href="http://favrik.com/projects/google/">Sample product page</a>.</p>

<h2>The API callback Page</h2>

<p>Set the URL for the API callback in <a href="https://sandbox.google.com/checkout/sell/settings?section=Integration">https://sandbox.google.com/checkout/sell/settings?section=Integration</a>. On the same page, in the Advanced Settings section, do not set the option &#8220;Require notification acknowledgments to specify the serial number of the notification&#8221; (not supported for the purposes of this mini tutorial).</p>

<p>Create a webpage to receive the Notifications.  For example, to quickly test if it is working:</p>

{% highlight php %}
<?php
$xml_response = isset($HTTP_RAW_POST_DATA)
                ? $HTTP_RAW_POST_DATA:file_get_contents("php://input");
if (get_magic_quotes_gpc()) {
    $xml_response = stripslashes($xml_response);
}

mail('mail@example.com', 'GC Callback ' . date('d/m/Y H:i:s', time()), 
     'AHA!' . "\n\n" . $xml_response . "\n\n" . print_r($_SERVER, 1));

header('HTTP/1.0 200 OK');
exit;
{% endhighlight %}

<h2>That's it</h2>

<p>Hopefully, this was a brief mini-tutorial but productive in giving you some hints or quick steps to move forward with your custom integration.</p>


