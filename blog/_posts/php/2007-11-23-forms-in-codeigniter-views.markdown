--- 
wordpress_id: 31
layout: post
title: Forms in CodeIgniter Views
wordpress_url: http://blog.favrik.com/2007/11/23/forms-in-codeigniter-views/
meta_description: An experiment on creating forms in CodeIgniter with a passive code generator
meta_keywords: forms,codeigniter,php,code generator 
category: [php]
---
<p class="update"><strong>UPDATE 4 March 2009:</strong> I have PHP5 hosting now, so you can see the script <a href="/examples/formgen.php">here</a>.  Additionally, I'm grabbing ideas on how to create a piece of code that takes the pain from creating forms, with CodeIgniter in mind. Mainly, because CI is pretty simple.  Have one, or more ideas?  Add it by commenting at the end of this page!</p>

When you hand code your (x)HTML and, in addition, your CSS, Javascript, and PHP code; things start to look boring. Very Boring!  Repetition is <a href="http://www.urbandictionary.com/define.php?term=ftl">FTL</a>.  So we, coders, are always on the look for items, techniques, paradigms, frameworks, etc. that reduce the water in our systems. In other words, make us <a href="http://en.wikipedia.org/wiki/Don't_repeat_yourself">DRY</a>.

From the perspective of an XHTML hand-coder and <a href="http://www.codeigniter.com/user_guide/">CodeIgniter</a> user, a  form generator *could* be useful in the sense of doing more in less time.  This is a simple passive code generator. It takes into account what you would usually put in an "Add", or "Edit" form. The point here is to write a bit of information, and then, modify the result.

<h2>For Example</h2>
You can use the <a href="/examples/formgen.php">online generator</a> to test. For a contact a form you could use the following <a href="http://en.wikipedia.org/wiki/Comma-separated_values">CSV</a> file:
{% highlight text %}
name, text, Your Name, alpha
email, , Your Email, required|valid_email
message, textarea, Your Message, required
{% endhighlight %}

The output code, and browser display (with bare CSS) can be seen in the following screenshot:
<a href="http://blog.favrik.com/images/formgen.png"><img src="/images/formgen_t.png" alt="screenshot of a form generator" /></a>

The first "layout" is table based, and the second is from a <a href="http://www.sitepoint.com/article/fancy-form-design-css">Fancy Form CSS</a>.

<del>Sadly, my current (sponsored) host, does not support PHP5 yet! >_<  So <a href="http://lab.favrik.com/CIformgen/formgen.txt">grab a copy of the source code</a>, and put it in your sandbox to see it live.  </del>

Additionally, you can <a href="/examples/formgen.txt">download</a> the code, or review it right here:
{% highlight php %}
<?php
/**
 * Simple Form Generator
 *
 * A passive code generator for the html required to display forms, plus
 * the validation rules and logic of the CodeIgniter Validation library.
 *
 * COULD DO:
 * Save file dialog and preview
 * static selects
 * set value of radio buttons?
 * more layouts
 *
 * @author Favio Manriquez <favio@favrik.com>
 */
class FormGenerator 
{
    public  $Fields       = array();
    private $Data;
    private $Repopulate   = true;
    private $Editing      = false;
    private $InlineErrors = true;
    private $RulePadding  = 0;
    private $Rules;

    function __construct($data) 
    {
        $this->Data = $data;
    }

    public function TableLayout($tab = 0) 
    {
        $this->processFields();
        $output = "\n" . $this->spacer($tab) . "<table>\n";
        $colspan = '';
        foreach ($this->Fields as $f) {
            if ($f->type == 'checkbox' or $f->type == 'radio') {
                $colspan = ' colspan="2"';
                $row = $f->type == 'checkbox' ?
                         $this->spacer(2 + $tab) . "<td class=\"checkbox\">$f->field $f->label<span>$f->error</span></td>\n"
                       :   $this->spacer(2 + $tab) . "<th>$f->label</th>\n"
                         . $this->spacer(2 + $tab) ."<td>$f->field<span>$f->error</span></td>\n";
            } else {
                $row  = $this->spacer(2 + $tab) . "<th>$f->label</th>\n";
                $row .= $this->spacer(2 + $tab) . "<td>$f->field<span>$f->error</span></td>\n";
            } 
            $output .= $this->spacer(1 + $tab) . "<tr$colspan>\n";
            $output .= $row;
            $output .= $this->spacer(1 + $tab) . "</tr>\n";
        }
        $output .= $this->spacer($tab) . '</table>';
        return  $output;
    }

    public function FancyFormLayout($tab = 0)
    {
        $this->processFields();
        $output = "\n" . $this->spacer($tab) . "<fieldset>\n<ol>\n";
        foreach ($this->Fields as $f) {
            $output .= $this->spacer(1 + $tab) . "<li>\n";
            $output .= $this->spacer(2 + $tab) . $f->label . $f->field . "\n";
            $output .= $this->spacer(1 + $tab) . "</li>\n";
        }
        $output .= $this->spacer($tab) . "</ol>\n</fieldset>\n";
        return $output;
    }

    public function Rules()
    {
        return "<?php\n".$this->Rules."?>\n";
    }
    
    public function getLabelLayout() {}
    

    public function repopulate($status)
    {
        $this->Repopulate = $status;
        return $this;
    }

    public function editing($status)
    {
        $this->Editing = (boolean) $status;
        return $this;
    }
    
    public function inlineErrors($status)
    {
        $this->InlineErrors = $status;
        return $this;
    }    

    public function spacer($space = 1)
    {
        return str_repeat(' ', $space * 4);
    }

    private function processFields() 
    {
        $this->Fields = array();
        $previous = new stdClass();
        $lines = explode("\n", $this->Data);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }
            $field      = array_map('trim', explode(',', $line));
            $F          = new stdClass();
            $F->name    = array_shift($field);
            $F->type    = $this->fetchProperty($field, $previous->type);
            $F->display = array_shift($field);
            $F->rules   = array_shift($field);
            $F->special = array_shift($field);
            $previous   = clone $F;
            $this->setPaddingForRules(strlen($F->name));
            $this->setField($F);
        }
        $this->setRules();
    }
    
    private function setPaddingForRules($length)
    {
        if ($length > $this->RulePadding) {
            $this->RulePadding = $length;
        }
    }


    private function fetchProperty(&$field, $previousValue = '')
    {
        $property = array_shift($field);
        if (is_null($property) or empty($property)) {
            return $previousValue;
        }
        return $property;
    }

    private function setField($field)
    {
        $inputs = array('text', 'password', 'hidden',
                        'file', 'checkbox', 'radio');
        if (in_array($field->type, $inputs)) {
            $field->field = $this->input($field);
        } else {
            $field->field = $this->{$field->type}($field);
        }
        $field->label = $this->setLabel($field);
        $field->error = $this->InlineErrors ? $this->setError($field) : '';  
        $this->Fields[] = $field;
    }
    
 

    private function setLabel($field)
    {
        return $this->label($field);
    }

    private function setRules()
    {
        $rules = '';
        foreach ($this->Fields as $F) {
            $rules .= $this->setRule($F);
        }
        $rules .= '$this->validation->set_rules($rules);' . "\n";
        $rules .= '$this->validation->set_fields($fields);' . "\n";
        $rules .= '$this->validation->set_error_delimiters(\'<div class="error">\',\'</div>\');' . "\n";
        $this->Rules = $rules;
    }

    private function setRule($field)
    {
        $base_pad = 13; // 12 for $rules reflectd on the output string
        $max      = $base_pad + $this->RulePadding;
        $current  = $base_pad + strlen($field->name);
        $total    = $max - $current;
        $Padding  = str_repeat(' ', $total + 1);

        $post_rules = empty($field->rules) ? '' : '|';
        return "\$rules ['$field->name']$Padding= 'trim|$field->rules{$post_rules}xss_clean';\n\$fields['$field->name']$Padding= '$field->display';\n";

    }

    private function setError($field)
    {
        return '<?php echo $this->validation->'. $field->name . '_error; ?>';
    }

    private function label($field)
    {
        $class = strpos($field->rules, 'required') !== false 
                 ? ' class="required"' : '';
        $colon = ':';
        if ($field->type == 'radio' or $field->type == 'checkbox') {
            $colon = '';
        }
        return '<label for="'.$field->name.'"'. $class .'>'.$field->display.$colon.'</label>';
    }

    private function setClass($field)
    {
        return "class=\"$field->type\" ";
    }

    /**
     * Possible field types: text, password, hidden, textarea, select,
     * checkbox, radio, file.
     *
     *
     */    
    private function input($field)
    {
        if ($field->type == 'checkbox') {
            $value = " value=\"1\" " . $this->setCheckboxValue($field);
        } else {
            $value = ' value="' . $this->setValue($field).'"';
        }
        return '<input '.$this->setClass($field).'id="'.$field->name.'" type="'.$field->type.'" name="'.$field->name.'" '.$value.' />';
    }
    
    private function select($field)
    {
        return '<select '.$this->setClass($field).'id="'.$field->name.'" name="'.$field->name.'"><option>--Select--</option>'
                .$this->setSelectValue($field).'</select>';
    }

    private function textarea($field)
    {
        return '<textarea '.$this->setClass($field).'id="'.$field->name.'" name="'.$field->name.'" rows="5" cols="40">'.$this->setValue($field).'</textarea>';
    }
    
    private function setValue($field)
    {
        if ($this->Repopulate) {
            $v = $this->Editing 
                 ? "<?php echo (\$this->validation->{$field->name}) ? (\$this->validation->{$field->name}) : \$editing->{$field->name}; ?>" 
                 : '<?php echo $this->validation->' . $field->name . '; ?>';
            return $v;
        }
        return '';
    }
   
    private function setSelectValue($field)
    {
        if ($this->Repopulate) {
            $selected = "<?php if (\$this->validation->{$field->name} == \$option->value) { echo 'selected=\"selected\"';} ?>";
            if ($this->Editing) {
                $selected = "<?php if (\$this->validation->{$field->name} == \$option->value or \$editing->{$field->name} == \$option->value) { echo 'selected=\"selected\"';} ?>";
            }
            $php  = "<?php foreach (\$$field->special as \$option): ?>";
            $php .= "<option $selected value=\"<?php echo \$option->value; ?>\"><?php echo \$option->text;?></option>";
            $php .= "<?php endforeach; ?>";
            return $php;
        }
    }

    private function setCheckboxValue($field)
    {
        if ($this->Repopulate) {
            $v = $this->Editing
                 ? "<?php echo (\$this->validation->set_checkbox('$field->name', '1')) ? (\$this->validation->set_checkbox('$field->name', '1')) : \$checked; ?>"
                 : "<?php echo \$this->validation->set_checkbox('$field->name', '1'); ?>";
            return $v;
        }
    }
}
?>
<!-- OMFG no Doctype!!! -->
<html>
<head>
<title>CodeIgniter Formgen</title>
<style type="text/css">
fieldset {  
margin: 1.5em 0 0 0;  
padding: 0;
}
legend {  
margin-left: 1em;  
color: #000000;  
font-weight: bold;
}
fieldset ol {  
padding: 1em 1em 0 1em;  
list-style: none;
}
fieldset li {  
padding-bottom: 1em;
}
fieldset.submit {  
border-style: none;
}
label {  
display: block;
}
label {  
float: left;  
width: 10em;  
margin-right: 1em;
}
fieldset li {  
float: left;  
clear: left;  
width: 100%;  
padding-bottom: 1em;
}
fieldset {  
float: left;  
clear: left;  
width: 100%;  
margin: 0 0 1.5em 0;  
padding: 0;
}

fieldset ol {  
padding-top: 0.25em;
}
fieldset {  
float: left;  
clear: both;  
width: 100%;  
margin: 0 0 1.5em 0;  
padding: 0;  
border: 1px solid #BFBAB0;  
background-color: #F2EFE9;
}

</style>
</head>
<body>
<h1>Generate a CodeIgniter "Form View" from a CSV input</h1>
<h2>Just an experiment in code generation</h2>
<h3>Format of input</h3>
<p>
Every line is a form field. The "columns" from left to right are: 
</p>
<ol>
<li>Field Name</li>
<li>Field Type (text, radio, checkbox, select, textarea)</li>
<li>Field Label</li>
<li>CodeIgniter rules</li>
<li>Special values. This is optional and used for select fields.</li>
</ol>
<form method="get" action="">
<label for="csv">Input:</label><br />
<textarea name="csv" rows="10" id="csv" cols="80">
<?php if (isset($_GET['csv'])): ?>
<?php echo $_GET['csv']; ?>
<?php else: ?>
name, text, Your Name, alpha
email, , Your Email, required|valid_email
message, textarea, Your Message, required
<?php endif; ?>
</textarea><br />
<input type="submit" value="Get Form" /> &nbsp;  <input type="checkbox" style="display:inline; float:none" id="edit" name="editing" value="1" /> <label for="edit" style="display:inline; float:none">Edit Form?</label>
</form>
<?php
if (isset($_GET['csv'])) {
    $formgen = new FormGenerator($_GET['csv']);
    $form = $formgen->inlineErrors(true)
                    ->editing(isset($_GET['editing']))
                    ->repopulate(true)
                    ->TableLayout();
    $form .= $formgen->FancyFormLayout();
    echo '<textarea style="white-space:nowrap; display:block" wrap="off" rows="40" cols="100">';
    echo htmlentities($formgen->Rules());
    echo htmlentities($form);
    echo '</textarea>';
    echo $formgen->inlineErrors(false)->repopulate(false)->TableLayout();
    echo $formgen->FancyFormLayout();
}
?>
</body>
</html>
{% endhighlight %}
Happy hacking!
