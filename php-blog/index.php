<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8' />
    <title>Blog title</title>
</head>
<body>
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
       <h1>Blog hi</h1>
<?php
    $all_posts = scandir('./posts');
    foreach ($all_posts as $key => $postname) {
        $post = fopen('./posts/'.$postname, 'r');
        echo '<article>'.fread($post, 2000).'</article>';
    }
?>
   </section>
</body>
</html>
