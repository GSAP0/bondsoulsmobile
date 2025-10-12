<template>

  <div v-if="interests.length" class="section">

    <div class="title">ΕΝΔΙΑΦΕΡΟΝΤΑ</div>



    <!-- Εξωτερική κάρτα ενότητας -->

    <div class="card">

      <!-- Εσωτερικό “κουτί” pills (rounded + λεπτό border) -->

      <div class="pill-box">

        <div class="pills">

          <span v-for="(t,i) in interests" :key="i" class="pill">{{ t.interest }}</span>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
interface Props {
  interests
}

const props = defineProps<Props>()
</script>

<style scoped>

/* Υποθέτουμε ότι ο root container έχει theme class: .theme-dark / .theme-light

   (ίδιες με τις άλλες οθόνες). ΜΟΝΟ τα colors αλλάζουν ανά theme. */



/* Βασικά */

.section { padding: 8px 16px; }

.title {

  font-size: .7rem; font-weight: 600; letter-spacing: 1px;

  text-transform: uppercase; color: var(--muted); margin-bottom: 8px; padding: 0 4px;

}



/* Εξωτερική κάρτα */

.card {

  border-radius: 24px;

  background: var(--rowBg);

  border: 1px solid var(--rowBorder);

  padding: 8px;

}



/* Εσωτερικό “κουτί” pills */

.pill-box {

  border-radius: 20px;

  background: var(--pillBoxBg);

  border: 1px solid var(--pillBoxBorder);

  padding: 10px;

}



/* Πλέγμα pills */

.pills { display: flex; flex-wrap: wrap; gap: 10px; }



/* Το pill */

.pill {

  display: inline-flex; align-items: center; justify-content: center;

  padding: 8px 12px; border-radius: 999px;

  font-size: 12px; line-height: 1;

  background: var(--pillBg);

  color: var(--pillText);

  border: 1px solid var(--pillBorder);

}



/* ---------- Light / Dark χρωματισμοί ---------- */

.theme-light :where(.card)     { /* ήδη παίρνει από rowBg/rowBorder */ }

.theme-light :where(.pill-box) { --pillBoxBg: #FFFFFF; --pillBoxBorder: rgba(0,0,0,0.10); }

.theme-light :where(.pill)     {

  --pillBg: #E1EDFF;                /* όπως στο αρχικό */

  --pillBorder: rgba(0,0,0,0.10);

  --pillText: #11181C;

}



.theme-dark  :where(.card)     { /* ήδη παίρνει από rowBg/rowBorder */ }

.theme-dark  :where(.pill-box) { --pillBoxBg: rgba(10,132,255,0.08); --pillBoxBorder: rgba(10,132,255,0.15); }

.theme-dark  :where(.pill)     {

  --pillBg: rgba(10,132,255,0.22);  /* όπως στο αρχικό */

  --pillBorder: rgba(255,255,255,0.12);

  --pillText: #F5F7FA;

}

</style>