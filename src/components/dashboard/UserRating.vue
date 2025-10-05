<template>
    <div style="border-radius: 99%;
    border: 1px solid black;
    width: 35px;
    height: 35px;
    text-align: center;
    padding-top: 5px;">
      {{ user.ratings_avg }}
    </div>
</template>


<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {computed} from "vue";

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
</script>
