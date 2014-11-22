<?php
require_once 'login-info.php';
$status = '';
if (!empty($_POST)) {
    if (check_login($_POST)) {
        $status = 'success';
    } else {
        $status .= '<p class="error">El usario o el password son incorrectos. Revisa tus datos e intenta de nuevo.</p>';
    }   
}
echo $status;
?>