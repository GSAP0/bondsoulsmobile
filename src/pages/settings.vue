<!-- SettingsScreen.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <PageHeader :title="title" default-href="/dashboard"/>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding" :class="store.themeClass">
      <!-- Settings List -->
      <div class="list">
        <!-- Plans -->
        <button type="button" @click="onPlans" class="row plans">
          <div class="row-title">Πακέτα subscription</div>
          <div class="row-right">
            <span class="row-arrow">›</span>
          </div>
        </button>

        <!-- Invite -->
        <button type="button" @click="onInvite" class="row">
          <div class="row-title">Προσκάλεσε φίλους <br> <small>Κωδικός πρόσκλησης: {{ store.user.value.referral_code }}</small></div>
        </button>

        <!-- Theme -->
        <button type="button" class="row control" aria-disabled="true">
          <div class="row-title">Dark mode</div>
          <div class="row-right">
            <ion-toggle
                :checked="store.currentTheme.value === 'dark'"
                @ionChange="toggleTheme"
                class="toggle"
            />
          </div>
        </button>

        <!-- Interests -->
        <button type="button" @click="onInterests" class="row" :class="{ locked: !userIsPaid }">
          <div class="row-title">Ενδιαφέροντα</div>
          <div class="row-right">
            <span v-if="!userIsPaid" class="lock" aria-hidden="true">🔒</span>
            <span v-else class="row-arrow">›</span>
          </div>
        </button>

        <!-- Bio -->
        <button type="button" @click="onBio" class="row" :class="{ locked: !userIsPaid }">
          <div class="row-title">Σχετικά με εμένα</div>
          <div class="row-right">
            <span v-if="!userIsPaid" class="lock" aria-hidden="true">🔒</span>
            <span v-else class="row-arrow">›</span>
          </div>
        </button>

        <!-- Location -->
        <button type="button" @click="onLocation" class="row" :class="{ locked: !userIsPaid }">
          <div class="row-title">Τοποθεσία</div>
          <div class="row-right">
            <span v-if="!userIsPaid" class="lock" aria-hidden="true">🔒</span>
            <span v-else class="row-arrow">›</span>
          </div>
        </button>

        <!-- Username -->
        <button type="button" @click="onUsername" class="row" :class="{ locked: !userIsPaid }">
          <div class="row-title">Επεξεργασία Username</div>
          <div class="row-right">
            <span v-if="!userIsPaid" class="lock" aria-hidden="true">🔒</span>
            <span v-else class="row-arrow">›</span>
          </div>
        </button>
      </div>
      <!-- Paywall -->
      <div v-if="showPaywall" class="overlay">
        <div class="sheet" :class="store.currentTheme">
          <div class="sheet-body">
            <div class="sheet-title">Απαραίτητη συνδρομή</div>
            <div class="sheet-text">
              Η λειτουργία «{{ payItem }}» είναι διαθέσιμη με συνδρομητικό πακέτο.
              Αναβάθμισε για να τη ξεκλειδώσεις και να συνεχίσεις.
            </div>
          </div>
          <div class="sheet-actions" :class="store.currentTheme">
            <button class="btn-outline" @click="showPaywall = false">Άκυρο</button>
            <button class="btn-accent" @click="goPlans">Δες πακέτα</button>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <div class="text-center px-5 pb-5">
        <ion-button @click="confirmLogout" color="danger" expand="block">Αποσύνδεση</ion-button>
      </div>

    </ion-footer>
  </ion-page>
</template>

<script setup>
import {ref, computed} from 'vue';
import {IonPage, IonContent, IonToggle, IonHeader, IonButton, alertController} from '@ionic/vue';
import {useGlobal} from "@/composables/useGlobal.js";
import PageHeader from '@/components/PageHeader.vue';

const title = 'Ρυθμίσεις';
const userIsPaid = false;

const store = useGlobal()

const toggleTheme = (ev) => {
  store.currentTheme.value = !!ev.detail.checked ? 'dark' : 'light';
};

const showPaywall = ref(false);
const payItem = ref(null);

const triggerPaywall = (title) => {
  payItem.value = title;
  showPaywall.value = true;
};

const onPlans = () => {
  // TODO: Navigate to plans page
  console.log('Πακέτα subscription');
};

const onInvite = () => {
  // TODO: Navigate to invite friends page
  console.log('Προσκάλεσε φίλους');
};

const onInterests = () => {
  if (!userIsPaid) {
    triggerPaywall('Ενδιαφέροντα');
    return;
  }
  // TODO: Navigate to interests page
  console.log('Ενδιαφέροντα');
};

const onBio = () => {
  if (!userIsPaid) {
    triggerPaywall('Σχετικά με εμένα');
    return;
  }
  // TODO: Navigate to bio page
  console.log('Σχετικά με εμένα');
};

const onLocation = () => {
  if (!userIsPaid) {
    triggerPaywall('Τοποθεσία');
    return;
  }
  // TODO: Navigate to location page
  console.log('Τοποθεσία');
};

const onUsername = () => {
  if (!userIsPaid) {
    triggerPaywall('Επεξεργασία Username');
    return;
  }
  // TODO: Navigate to username edit page
  console.log('Επεξεργασία Username');
};

const goPlans = () => {
  showPaywall.value = false;
  onPlans();
};

const confirmLogout = async () => {
  const alert = await alertController.create({
    header: 'Αποσύνδεση',
    message: 'Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;',
    buttons: [
      {
        text: 'Άκυρο',
        role: 'cancel'
      },
      {
        text: 'Αποσύνδεση',
        role: 'confirm',
        handler: () => {
          store.logout();
        }
      }
    ]
  });

  await alert.present();
};
</script>