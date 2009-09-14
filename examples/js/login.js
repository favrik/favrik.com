

$(document).ready(function() { 
    var options = { 
        target: '#login-canvas',   // target element(s) to be updated with server response 
        beforeSubmit: showRequest,  // pre-submit callback 
        success: showResponse,  // post-submit callback 
        url: 'login_status.php',
        type: 'POST',
        timeout:6000};
    $('#login-form').ajaxForm(options);
    setFocus();
}); 
// pre-submit callback 
function showRequest(formData, jqForm, options) { 
    $('#loading').show();
    return true; 
} 
// post-submit callback 
function showResponse(responseText, statusText)  { 
    $('#loading').hide();
    
    setFocus();
    
    if (responseText == 'success') {
        $('#login-canvas').hide();
        top.location = 'login-success.php';
        return true;
    }
    return false;
}

function setFocus() {
    if (document.forms[0].username.value == null ||
        document.forms[0].username.value == "") {
        document.forms[0].username.focus();
    } else {
        document.forms[0].password.focus();
    }
}