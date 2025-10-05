<template>
  <div :style="`width: ${width}px`" style="border: 1px solid black; height: 25px; border-radius: 12px">
    <div :style="`width:${value}px`" style="height: 23px;border-bottom-left-radius: 12px; border-top-left-radius: 12px; background: rgb(0,0,0)"></div>
  </div>
  <div>{{width}}</div>
  <div>{{value}}</div>
</template>

<script setup>
import {computed} from "vue";
import {useGlobalStore} from "@/stores/globalStore.js";

const min = 70
const max = 130
const multiplier = 3
const width = (max - min) * multiplier
const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
const value = computed(() => parseFloat(user.value.elo) * 100 )
</script>