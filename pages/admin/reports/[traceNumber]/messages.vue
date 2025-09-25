<template>
  Messages
</template>

<script setup lang="ts">
  const route = useRoute();

  onMounted(() => {
    console.log(route.value);
  })
</script>

