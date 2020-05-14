<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  import Login from "@/components/login/Login";
  export default {
    name: 'app',
    components: {
      Login,
    }
  }
</script>
<style>
  @import "~@/assets/css/base.css";
#app {

}
</style>
