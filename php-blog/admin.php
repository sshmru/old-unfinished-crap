<?php 
session_start();
if (!$_SESSION['authenticated']){
    header('Location: login.php');
}

$postfile = 'posts/';
$imagefile = 'images/';
?>
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8' />
    <title>Administrative panel</title>
</head>
<body>
<?php
if ($_POST){
    if(isset($_FILES['uploadedFile'])){
        $target_path = $imagefile . basename($_FILES['uploadedFile']['name']);
        if(move_uploaded_file($_FILES['uploadedFile']['tmp_name'], $target_path)){
            echo "file uploaded: " . basename($_FILES['uploadedFile']['name']);
        }else{
            echo "upload failure";
        }
    }
    if(isset($_POST['postBody'])){
        $newpost = fopen($postfile . date('Y-m-d_H:i:s'), 'w');
        fwrite($newpost, $_POST['postBody']);
        fclose($newpost);
        echo "post saved</br>";
        echo $_POST['postBody'];
    }
}
?>
<nav>
    <div>
        <ul>
            <li>
                <a href='login.php'>Login</a>
            </li>
            <li>
                <a href='logout.php'>Logout</a>
            </li>
        </ul>
    </div>
</nav>
   <section>
        <div id='writepost'>
            <form action='<?php echo $PHP_SELF ?>' method='post'>
                <input type='text' class='text' name='postTitle' />
                <textarea name='postBody'></textarea>
                <input type='submit' class='submit' value='Post' name='submit'/>
            </form>
        </div>
        <div id='fileupload'>
            <form enctype="multipart/form-data" action='<?php echo $PHP_SELF ?>' method='post'>
                <input type='hidden' name='MAX_FILE_SIZE' value='100000' />
                <input type='file' class='file' value='Choose Image' name='uploadedFile' />
                <input type='submit' class='submit' value='Upload' name='submit'/>
            </form>
        </div>
   </section>
</body>
</html>
