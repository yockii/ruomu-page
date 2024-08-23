<script setup lang="ts">

</script>

<template>
  <div class="logo">
  </div>
</template>

<style scoped>
.logo {
  width: 25px;
  aspect-ratio: 1;
  display: grid;
}
.logo:before,
.logo:after {
  content: "";
  grid-area: 1/1;
  width: 12px;
  aspect-ratio: 1;
  box-shadow: 0 0 0 3px #111 inset;
  filter: drop-shadow(13px 13px 0 #111);
  animation: l8 2s infinite alternate;
}
.logo:after {
  margin: 0 0 0 auto;
  filter: drop-shadow(-13px 13px 0 #111);
  animation-delay: -1s;
}
@keyframes l8 {
  0%,10%   {border-radius:0}
  30%,40%  {border-radius:50% 0}
  60%,70%  {border-radius:50%}
  90%,100% {border-radius:0 50%}
}
</style>