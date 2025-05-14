<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-tabs>
        <ion-tab tab="person">
          <ion-tab-bar>Profile</ion-tab-bar>
          <DashboardProfile></DashboardProfile>
        </ion-tab>
        <ion-tab tab="chat">
          <ion-tab-bar>Chat</ion-tab-bar>
          <DashboardChat></DashboardChat>
        </ion-tab>
        <ion-tab tab="settings">
          <ion-tab-bar>Preferences</ion-tab-bar>
          <DashboardPreferences></DashboardPreferences>
        </ion-tab>


        <ion-tab-bar slot="bottom" ref="tabsRef">
          <ion-tab-button tab="person">
            <ion-icon :icon="person"/>
            Profile
          </ion-tab-button>
          <IonTabButton tab="chat">
            <ion-icon :icon="chatbubbles"/>
            Chat
          </IonTabButton>
          <ion-tab-button tab="settings">
            <ion-icon :icon="settings"/>
            Preferences
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {settings, chatbubbles, person} from "ionicons/icons";
import {IonIcon, IonTabBar, IonTabButton, IonTabs, IonTab, IonPage, IonContent} from "@ionic/vue";
import DashboardChat from "@/components/dashboard/DashboardChat.vue";
import DashboardPreferences from "@/components/dashboard/DashboardPreferences.vue";
import DashboardProfile from "@/components/dashboard/DashboardProfile.vue";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()
globalStore.load()
</script>