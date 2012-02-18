<?php
require_once 'login-info.php';
if (check_login($_POST)) {
    header('Location: login-success.php');
    exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
 "http://www.w3.org/TR/html4/loose.dtd">
<html lang="es">
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="stylesheet" href="css/blueprint/screen.css" type="text/css" media="screen, projection">
    <link rel="stylesheet" href="css/blueprint/print.css" type="text/css" media="print">
  <link rel="stylesheet" href="css/screen.css" type="text/css" media="screen">
  <title>Ejemplo: Formulario de Login con Ajax.</title>

  <script type="text/javascript" src="js/jquery.pack.js"></script>
  <script type="text/javascript" src="js/jquery.form.js"></script>
    <script type="text/javascript" charset="utf8" src="js/login.js"></script>

</head>
<body id="login">
<div class="container span-12">
    <div id="content" class="column span-12 first last">
        <div class="column span-3 first">&nbsp;</div>

    <div class="column span-6 last">
        <h1>Bienvenido</h1>
        <p>Es necesario iniciar sesión antes de continuar.</p>
        <?php include 'login_status.php'; ?>
        <div id="login-canvas"></div>
       <form id="login-form" action="login.php" method="post">
        <div class="column span-2 first">
            <p>
            <label for="username">Usuario:</label>

            </p>
            <p>
            <label for="password">Password:</label>
            
            </p>
            <div id="loading"><img src="images/asterisk.gif" alt="" /></div>
        </div>
        <div class="column span-4 last">
          <p><input type="text" name="username" id="username" size="16" /></p>

          <p><input type="password" name="password" id="password" size="16" /></p>
          <button type="submit"><img src="css/tick.png" />Iniciar Sesión</button>
        </div>
        <div class="column span-6 first last">
           <p><input type="checkbox" name="remember" id="remember" /><label for="remember" class="light">Recordar información</label>   |  <a href="login/recuperar-password">Olvidé mi password</a></p>
         </div>

       </form> 
    </div>
    <div class="column span-3 last">&nbsp;</div>
    </div>
</div>
</body>
</html>