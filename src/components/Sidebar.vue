<template>
  
   
    <div >
      <h1 class=" flex  justify-left text-6xl text-[rgb(29,161,242)] font-bold">Welcome to &nbsp</h1>
      <h1 class=" flex justify-left text-4xl font-bold">Student Management System</h1>
      <h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</h1>
      <h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</h1>
    </div >
    <div >
      <nav class="flex  text-lg space-x-8">
  <RouterLink :to="{name:'students'}" custom v-slot="{ navigate, isActive }">
    <a @click="navigate" :class="isActive ? 'border-b-4 border-[rgb(29,161,242)]   pb-3 cursor-pointer' : 'hover:border-b-4 hover:border-[rgb(29,161,242)] pb-1 cursor-pointer'">Student</a>
  </RouterLink>
<h1 class="font-xl font-bold">|</h1>
  <RouterLink :to="{name:'teachers'}" custom v-slot="{ navigate, isActive }">
    <a @click="navigate" :class="isActive ? 'border-b-4 border-[rgb(158,118,180)] pb-3 cursor-pointer' : 'hover:border-b-4 hover:border-[rgb(158,118,180)] pb-1 cursor-pointer '">Advisor</a>
  </RouterLink>
  <h1 class="font-xl font-bold">|</h1>
        <RouterLink :to="{name:'Login'}" v-if="!authStore.token" custom v-slot="{ navigate, isActive }">
          <a @click="navigate" :class="isActive ? 'border-b-4 border-[rgb(36,215,96)] pb-3 cursor-pointer' : 'hover:border-b-4 hover:border-[rgb(158,118,180)] pb-1 cursor-pointer '">Login</a>
        </RouterLink>
        <a v-else @click="logout" class="border-b-4 border-[rgb(36,215,96)] pb-3 cursor-pointer">Logout</a>
        <h1 class="font-xl font-bold">|</h1>
        <RouterLink :to="{name:'StudentForm'}" v-if="authStore.token" custom v-slot="{ navigate, isActive }">
          <a @click="navigate" :class="isActive ? 'border-b-4 border-[rgb(36,215,96)] pb-3 cursor-pointer' : 'hover:border-b-4 hover:border-[rgb(158,118,180)] pb-1 cursor-pointer '">Add Student</a>
        </RouterLink>
        <h1 class="font-xl font-bold" v-if="authStore.token">|</h1>
        <RouterLink :to="{name:'TeacherForm'}" v-if="authStore.token" custom v-slot="{ navigate, isActive }">
          <a @click="navigate" :class="isActive ? 'border-b-4 border-[rgb(36,215,96)] pb-3 cursor-pointer' : 'hover:border-b-4 hover:border-[rgb(158,118,180)] pb-1 cursor-pointer '">Add Teacher</a>
        </RouterLink>
</nav>
</div >
  

  
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  location.reload();
};
</script>






