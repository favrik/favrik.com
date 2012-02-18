<?php
function check_login($data) {
    if (!empty($data)) {
        $pass = md5('pass');
        $name = 'usuario';
        if ($data['username'] == $name
            and md5($data['password']) == $pass) {
            return true;
        }
    }
    return false;
}
?>