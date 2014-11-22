---
layout: post
title: Zend Form Recipes
meta_description:  Zend Form Recipes answers to common questions (or problems) when working with Zend Form
meta_keywords: Zend Form, Zend Framework, form, label colon,
category: [php]
---
When I had to work on a project using Zend Framework 1.10.X, I encountered a few issues/problems/obstacles.  Last time I worked with ZF, the version was 1.7.2, so things changed a bit. This post describes my solutions to those questions/issues/etc.

For reference, the application namespace prefix used in the following examples is <code>App</code>. 

1. [How to add colons to form labels?][1]
1. [Adding links to a label, or how to disable escaping for some labels?][2]
1. [How to add validation for Password verification?][3]
1. [Validating unique values accross the database for new users][4]
1. [How to add a field for uploading files?][5]
1. [How to add a recaptcha field?][6]


[1]: #colons
[2]: #escapeLabels
[3]: #password
[4]: #uniqueValues
[5]: #uploading
[6]: #recaptcha

## 1. <a name="colons"></a>How to add colons to the labels?
This is probably the least important topic about forms, however, I like my form labels with colons!  

The Zend Form Label decorators provides you with two methods to do this: <code>setRequiredSuffix()</code> and <code>setOptionalSuffix()</code>. But using a custom decorator saves some typing:

{% highlight php %}
<?php

// Set a base decorator path
class MyForm extends Zend_form
{
    // ...

    public function init()
    {
        $this->addElementPrefixPath(
            'App_Form_Decorator',
            'App/Form/Decorator/',
            'decorator'
        );
    }

    // ...
}

// Sample Label decorator
class App_Form_Decorator_ColonLabel extends Zend_Form_Decorator_Label
{
    public function getLabel()
    {
        $label = parent::getLabel();

        return $label . ':';
    }
}

{% endhighlight %}


## 2. <a name="escapeLabels"></a>Adding links to a label, or how to disable escaping for some labels?

It is very common to have an "Agree to terms" link as a checkbox on Signup forms. Since labels in Zend Form are escaped by default, in order to display arbitrary HTML, you need to set some options for the Label decorator. These are my default decorator for those kind of checkboxes:

{% highlight php %}
<?php
$checkboxDecorators = array(
   'ViewHelper',
    array('Label', array('placement' => 'APPEND', 'escape' => false)),
    array('Errors', array('class' => 'inlineError')),
    array(array('row' => 'HtmlTag'), 
          array('tag' => 'li', 'class' => 'checkbox')
    ),
);
{% endhighlight %}

Now, if you are using FormErrors and the field has an error, its label will display escaped even when you already said that you don't want that. The solution is to use a custom FormErrors decorator:

{% highlight php %}
<?php
class App_Form_Decorator_FormErrors extends Zend_Form_Decorator_FormErrors
{
    public function renderLabel(Zend_Form_Element $element, Zend_View_Interface $view)
    {
        $label = $element->getLabel();
        if (empty($label)) {
            $label = $element->getName();
        }
        $options = $element->getDecorator('label')->getOptions();
        $escape = isset($options['escape']) 
                  ? (bool) $options['escape'] : true;

        $labelOutput = $escape ? $view->escape($label) : $label;

        return $this->getMarkupElementLabelStart()
             . $labelOutput
             . $this->getMarkupElementLabelEnd();
    }
}
{% endhighlight %}

## 3. <a name="password"></a>How to add validation for Password verification?
This one is often seen on signup/registration forms.  Sometimes not only for passwords, but also for emails.  Here's an approach to adding this kind of validation.

First we define a base class called <code>EqualValue</code> and then the validation classes.

{% highlight php %}
<?php

// First let's setup access to custom validation rules:
class Signup_Form_Signup extends Zend_Form
{
    public function init()
    {
        $this->addElementPrefixPath(
            'Signup_Validate',
            APPLICATION_PATH . '/modules/signup/models/validate/',
            'validate'
        );
    }
}


// This belongs to the Signup module
class Signup_Validate_EqualValue extends Zend_Validate_Abstract
{
    const NOT_MATCH = 'notMatch';

    protected $_messageTemplates = array(
        self::NOT_MATCH => 'do not match'
    );

    protected $_verifyKey = '';

    public function isValid($value, $context=null)
    {
        $value = (string) $value;
        $this->_setValue($value);

        if (is_array($context)) {
            if (isset($context[$this->_verifyKey])
                && ($value == $context[$this->_verifyKey])) {
                return true;
            }
        } elseif (is_string($context) && ($value == $context)) {
            return true;
        }

        $this->_error(self::NOT_MATCH);

        return false;
    }
}


// Password Verification

/**
 * Validates that password and the password verification values are equal
 */
require_once 'EqualValue.php';

class Signup_Validate_PasswordVerification extends Signup_Validate_EqualValue
{
    public function isValid($value, $context=null)
    {
        $this->_verifyKey = 'password';
        $this->_messageTemplates[self::NOT_MATCH] = 
            'Passwords ' . $this->_messageTemplates[self::NOT_MATCH];

        return parent::isValid($value, $context);
    }
}


// Likewise for the Email Field

require_once 'EqualValue.php';

class Signup_Validate_EmailVerification extends Signup_Validate_EqualValue
{
    public function isValid($value, $context=null)
    {
        $this->_verifyKey = 'email';
        $this->_messageTemplates[self::NOT_MATCH] = 
            'Emails ' . $this->_messageTemplates[self::NOT_MATCH];

        return parent::isValid($value, $context);
    }
}
{% endhighlight %}

## 4. <a name="uniqueValues"></a>Validating unique values accross the database

{% highlight php %}
<?php
// The validation rule
class Signup_Validate_UniqueEmail extends Zend_Validate_Abstract
{
    const EMAIL_EXISTS = 'emailExists';

    protected $_messageTemplates = array(
        self::EMAIL_EXISTS => 'Email "%value%" already exists, did you forget your password?'
    );

    public function __construct(User_Service_Datasource $model)
    {
        $this->_model = $model;
    }

    public function isValid($value, $context=null)
    {
        $value = (string) $value;
        $this->_setValue($value);
        
        $user = $this->_model->getUserByEmail($value);
        if (false === $user) {
            return true;
        }

        $this->_error(self::EMAIL_EXISTS);
        return false;
    }
}

// Adding the validator inside your form

        $this->addElement('text', 'email', array(
            'filters'    => array('StringTrim', 'StringToLower'),
            'validators' => array(
                'EmailAddress',
                array('StringLength', false, array(1, 255)),
                array('UniqueEmail', false, array(new User_Service_Datasource)),
            ),
            'required'   => true,
            'label'      => 'signup_email',
            'decorators' => $this->elementDecorators
        ));

{% endhighlight %}


## 5. <a name="uploading"></a>How to add a field for uploading files

This is how I typically create an Upload field :

{% highlight php %}
<?php

// inside a form definition...

        $config = Zend_Registry::get('config');

        // adding a field for the user photo/picture
        $photoUploadDir = $config['files']['photoUploadDir'];
        $this->addElement('file', 'photo', array(
            'filters'    => array('StringTrim'),
            'validators' => array(
                array('StringLength', false, array(5, 50)),
                array('IsImage'),
                array('Upload'),
            ),
            'required'   => true,
            'label'      => 'Your Photo:',
            'destination' => $photoUploadDir,
            'decorators' => array(
                'File',
                array('Errors', array('class' => 'inlineError')),
                'Label',
                array(array('data' => 'HtmlTag'), array('tag' => 'li', 'class' => 'file'))
            ),
        ));

{% endhighlight %}

The main thing to remember is that the destination directory must exist and be writable.


## 6. <a name="recaptcha"></a>How to add a recaptcha field

Instead of using an <code>addElement()</code> method, I create the captcha field manually, and then add it.

{% highlight php %}
<?php
        public $bareDecorators = array(
            array('Errors', array('class' => 'inlineError')),
            array('Label', array('id' => 'captcha-input')),
            array(array('data' => 'HtmlTag'), 
                  array('tag' => 'li', 'class' => 'element')
            ),
            array(array('row' => 'HtmlTag'), array('tag' => 'li')),
        );


        $config = Zend_Registry::get('config');

        $recaptcha = new Zend_Service_ReCaptcha(
            $config['recaptcha']['publickey'], 
            $config['recaptcha']['privatekey']
        );
        
        $captcha = new Zend_Form_Element_Captcha('captcha', array(
            'label' => 'Please confirm you are human:',
            'captcha' => array(
                'captcha' => 'ReCaptcha',
                'service' => $recaptcha,
            ),
            'decorators' => $this->bareDecorators,
        ));

        $this->addElement($captcha);

{% endhighlight %}


That's all I could think of at this time. I'm sure there are other topics worth putting in a &#8220;recipe&#8221; compilation, so feel free to post a comment. ;)

