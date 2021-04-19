<?php
    include_once(dirname(__FILE__) . "/config/config.inc.php");
    
    header('Content-Type: text/html; charset=utf-8');
    session_start();

    if (!isset($_SESSION['login']) || ! $_SESSION['login']) {
 // echo "<pre>";
 // print_r($_COOKIE);
 // echo "</pre>";
        //header('Location: login');
    }

?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <title>ReBooth</title>

  <!-- favicon for all devices -->
  <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png">
  <link rel="manifest" href="/images/icons/site.webmanifest">
  <link rel="mask-icon" href="/images/icons/safari-pinned-tab.svg" color="#5bbad5">
  <link rel="shortcut icon" href="/images/icons/favicon.ico">

  
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>  
  
  <!-- Bootstrap 4 alerts, confirm, prompt boxex -->
  <script src="js/bootbox.min.js"></script>
  
<script src="js/utils.js"></script>
<link rel="stylesheet" href="css/rebooth.css?0.01">

<script src="config/config.js?0.01"></script>
<script src="js/rebooth.js?0.01"></script>
  
  
<style>
body {
    background-image: url("images/logo.png");
    background-repeat: no-repeat;
}
</style>

  
<script>

const isLogged = <?= isset($_SESSION['login']) && $_SESSION['login'] ? "true" : "false" ?>;

console.log(isLogged);


$(document).ready(function() {
    
    // Set title
    $('#application-name').html(AppName + " v" + AppVersion);
    
    $('#version').html('[ ' + AppName + ' v' + AppVersion + ' &dash; clone it from <a target="_blank" href="' + AppGitHub + '">GitHub</a> ]');
    $('#author').html("By " + AppAuthorShort + " and " + AppContributorsShort + " &dash; " + AppCompanyShort);
    
    
    if (isLogged) {
        $('#logout').removeClass('disabled');
    } else {
        window.location.replace('/login');
        
    }
    

});

</script>



</head>
<body>
  <div class="container">
  

    <div class="row mt-4">
      <div class="col-sm-2"></div>
      <div class="mx-auto col-sm-8 bp-4">
      
  
  
        <div class="card bg-light mt-2">
          <div class="card-header">
              <div class="display-4"><span id="application-name"></span></div>
          </div>
          <div class="card-body">
            <h5 class="card-title">Welcome to ReBooth</h5>
            <p class="card-text">ReBooth (which stands for <em>Remote Booth</em>) is a WebRTC based platform for conference interpreter training, connecting an instructor (teacher, trainer, assessor, &hellip;) and a small group of students.</p>
            
            
            <ul class="list-group">
              <li class="list-group-item"><a class="btn btn-sm btn-success" href="setup">Set up a class</a><br/><div class="mt-2" style="font-size: 0.85rem">Click here to create a class and start it. You can download the instructor manual <a href="files/manual.pdf" target="_blank">here</a>.</div></li>
              <li class="list-group-item"><a class="btn btn-sm btn-success" href="booth">Enter a booth</a><div class="mt-2" style="font-size: 0.85rem">Normally, students access their booths via invitation links. You can however log in from here by entering the teacher's email address and the PIN she/he will have given you.</div></li>
            </ul>
            
            <p class="card-text"></p>
            
          </div>
          <div class="card-footer text-right">
            <a class="btn btn-primary disabled" href="logout" id="logout">Logout</a>
          </div>
        </div>  
  
  
  
      
      </div>
      <div class="col-sm-2"></div>
    </div>
  
  
  <div style="position: absolute; bottom: 2; left:10; right:10; width: vw" class="d-flex justify-content-between bg-light">
    <div id="version" class="credits"></div>
    <div><span id="author" class="credits"></span> &#128073; <a href="/credits">credits</a></div>
  </div>
  
  
 
  </div>
</body>
</html>