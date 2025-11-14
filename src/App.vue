<template>
  <main class="container">
    <h1>Mini Forms App</h1>
    <OrderForm />
    <hr />
    <SubmissionsList />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OrderForm from './components/OrderForm.vue'
import SubmissionsList from './components/SubmissionsList.vue'

export default defineComponent({
  name: 'App',
  components: {
    OrderForm,
    SubmissionsList
  }
})
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>


