<?php
session_start();
if ($_POST['username'] === 'admin' && $_POST['password'] === 'password') {
    $_SESSION['authenticated'] = true;
    header('Location: admin.php');
}else{
    header('Location: login.php');
}
?>
