---
layout: post
title: Preview all Pygments Styles for your code highlighting needs
meta_description: A blog post that shows all the pygments styles available on my computer  
meta_keywords: pygments, pygments styles, css, code highlight, code highlighting
category: [css]
---

For quickly outputting all the styles (available on my system) I used:

{% highlight bash %}
$ for i in  monokai manni perldoc borland colorful default murphy 
            vs trac tango fruity autumn bw emacs pastie friendly native;
    do pygmentize -f html -S $i -a .highlight > $i.css; 
  done
{% endhighlight %}

<noscript>
This doesn't work without Javascript. :(
</noscript>

So now you should be able to preview a stylesheet by just clicking on any of the following links:

<div id="stylesheetNavigator" class="stylesheetSelector"></div>

{% highlight php %}
<?php 
class A_Request {

    private $_fields = array(
        'title',
        'fullname',
        'email',
        'company',
      );

    private $_optional_fields = array(
        'company',
    );

    private $_specific_validations = array(
        'email' => 'valid_email',
    );

    private $_request;

    private $_errors;

    private $_model;

    public function __construct() {
        $this->_request = array();
        $this->_errors  = array();
    }

    public function initialize($data) {
        foreach ($this->_fields as $field) {
            if ( ! in_array($field, $this->_optional_fields)) {
                if (array_key_exists($field, $this->_validation_exceptions)) {
                    $method = $this->_validation_exceptions[$field];
                    $this->$method($data[$field]);
                    continue;
                }

                if (isset($data[$field]) AND !empty($data[$field])) {
                    if (array_key_exists($field, $this->_specific_validations)) {
                        $method = $this->_specific_validations[$field];
                        $this->$method($data[$field]);
                    }
                    $this->_request[$field] = $data[$field];
                } else {
                    $this->_errors[$field] = 'error';
                }
            } else {
                if (isset($data[$field])) {
                    $this->_request[$field] = $data[$field];
                }
            }
        }
    }

    public function get_fields() {
        if ( ! empty($this->_request)) {
            return $this->_request;
        }

        return $this->_fields;
    }

    public function get_errors() {
        if ( ! empty($this->_errors)) {
            $this->_errors['has_errors'] = true;
        }

        return $this->_errors;
    }

	public function valid_email($str) {
        $valid = ( ! preg_match(
            "/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", 
            $str
        ) ) ? FALSE : TRUE;

        if ( ! $valid) {
            $this->_errors['email'] = 'error';
        }
	}

    public function is_valid() {
        if (empty($this->_errors)) {
            return true;
        }

        return false;
    }

    public function set_model($model) {
        $this->_model = $model;
    }

    public function create() {
        return $this->_model->create($this->_request);
    }

    public function get($id) {
        return $this->_model->get($id);
    }

}
{% endhighlight %}


<script>

var StyleSwitcher = function (container) {
    this.container = container;
    this.init();
};

StyleSwitcher.prototype = {
    styles: ['monokai', 'manni', 'perldoc', 'borland', 'colorful',
            'default', 'murphy', 'vs', 'trac', 'tango', 'fruity',
            'autumn', 'bw', 'emacs', 'pastie', 'friendly', 'native'],
    
    init: function () {
        this.createSelector();
        this.addClickEvent();
    },

    createSelector: function () {
        var ul = document.createElement('ul'),
            a = null,
            li = null,
            i = null;

        for (i in this.styles) {
            li = document.createElement('li');
            a = document.createElement('a');
            a.appendChild(document.createTextNode(this.styles[i]));
            a.setAttribute('href', '#' + this.container);
            li.appendChild(a);
            ul.appendChild(li);
        }

        document.getElementById(this.container).appendChild(ul);
    },

    addClickEvent: function () {
        var c = this,
            f = function (e) {
                c.change(e);
            };
        document.getElementById(this.container).onclick = f;

    },

    change: function (e) {
        if (typeof e.target.text !== 'undefined') {

            this.appendLink(e.target.text);
        }
    },

    appendLink: function (style) {
        var head = document.getElementsByTagName('head'),
            link = null,
            sheets = document.getElementsByTagName('link');

        if (document.getElementById('myss') === null) {
            for (var i=0; (a = sheets[i]); i++) {
                if (a.getAttribute("href").indexOf("syntax") != -1) {
                    a.disabled = true;
                }
            }

            link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('id', 'myss');
            link.setAttribute('type', 'text/css');
            head[0].appendChild(link);
        } else {
            link = document.getElementById('myss');
        }

        link.setAttribute('href', '/css/' + style + '.css');
         
    }
};


new StyleSwitcher('stylesheetNavigator');
</script>

