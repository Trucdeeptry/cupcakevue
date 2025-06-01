<template>
 
    <div id="loading" class="fixed z-10 w-screen h-screen" style="background-color: rgb(0, 0, 0, 0.5);">
        <video class="img" autoplay muted loop  oncontextmenu="return false;">
          <source src="../../public/img/Animation - 1730048700021.webm" type="video/webm">
        </video>
    </div>
  
  </template>
  
  <script>
  export default {
    name: "Loading"
  };
  </script>
  
<style>
#loading {
  top: 0;
  width: 100%;
  height: 100%;
}
.img {
padding: 10% 0;
  margin: auto;
}
</style>