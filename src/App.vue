<template>
  <div>
    <nav-menu></nav-menu>
    <section class="app-main">
      <router-view></router-view>
    </section>
  </div>
</template>
<script>
  import NavMenu from './components/Menu'
  export default {
    name: 'app',
    components: {
      NavMenu
    }
  }

</script>
<style>
  .app-main {
    padding-top: 50px;
    margin-left: 250px;
    transform: translateZ(0);
  }
  
  @media screen and (max-width: 765px) {
    .app-main {
      margin-left: 0px;
    }
  }

</style>
