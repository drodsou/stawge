export default function () { 
return /*css*/`
  
  body {
    font-family: sans-serif;
    color: black;
    background-color: #d6d6d6;
    margin:0;
    padding:0;
  }
  
  .main-container {
    margin:20px;
    padding:10px;
  }

  .post-container {
    border: 1px solid black;
    border-radius:10px;
    padding: 10px;
  }

  nav {
    display: flex;
    background-color: #a1c0e4;
    margin:0;
    height: 30px;
    align-items: center;
  }

  .logo {
    width: 80px;
    padding-left: 10px;


  }
  ul.menu {
    display:flex;
    flex:1;
    list-style-type: none;
    margin:0;
    padding:0;
  }

  ul.menu li {
    margin-right: 10px;
  }
  
  ul.menu a {
    text-decoration: none;
    color:black;
  }

  ul.menu a:visited {
    color: black;
  }

  .blog-list a {
    text-decoration: none;
    color: blue;
  }

  .blog-list a:visited {

    color: grey;
  }

`;}