<template>
  <div>
    <div
        v-for="(val, group) of items"
        :key="group"
        class="my-1"
    >
      <div class="label">
        {{ group }}
      </div>
      <div class="bar-container">
        <div class="bar-background"/>
        <div
            v-if="val > 0"
            class="bar-positive"
            :style="{ width: `${val * 100 / 2}%` }"
        />
        <div
            v-else
            class="bar-negative"
            :style="{ width: `${Math.abs(val) / 2}%` }"
        />
      </div>
      <hr class="my-2" style="background: #d9d9d9;"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['items'])
</script>


<style scoped>
.bar-container {
  border-radius: 10px;
  position: relative;
  height: 10px;
  background-color: #e0e0e0;
  overflow: hidden;
}

.bar-background {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  background-color: black; /* Κέντρο (μηδέν) */
}

.bar-positive {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  background-color: #4caf50; /* Πράσινο */
  transform-origin: left;
}

.bar-negative {
  position: absolute;
  top: 0;
  right: 50%;
  height: 100%;
  background-color: #f44336; /* Κόκκινο */
  transform-origin: right;
}

.label {
  margin-bottom: 4px;
}
</style>