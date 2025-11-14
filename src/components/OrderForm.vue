<script setup lang="ts">
import { ref } from 'vue';
import { API_BASE } from '../api';

const name = ref('');
const product = ref('');
const date = ref<string>('');
const paymentMethod = ref<'card'|'paypal'|'bank'>('card');
const agree = ref(false);

const errors = ref<Record<string, string>>({});
const submitting = ref(false);
const successMsg = ref('');

function validate() {
  errors.value = {};
  if (!name.value || name.value.length < 2) errors.value.name = 'Name must be at least 2 characters';
  if (!product.value) errors.value.product = 'Please select a product';
  if (!date.value) errors.value.date = 'Please choose a date';
  if (!paymentMethod.value) errors.value.paymentMethod = 'Please select a payment method';
  if (!agree.value) errors.value.agree = 'You must accept terms';
  return Object.keys(errors.value).length === 0;
}

async function submitForm() {
  if (!validate()) return;
  submitting.value = true;
  try {
    const payload = {
      formId: 'order-form-v1',
      name: name.value,
      product: product.value,
      date: date.value,
      paymentMethod: paymentMethod.value,
      agree: agree.value
    };
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit');
    successMsg.value = 'Submitted!';
    name.value = ''; product.value = ''; date.value = ''; paymentMethod.value = 'card'; agree.value = false;
  } catch (e:any) {
    errors.value.form = e.message ?? 'Submission failed';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section>
    <h2>Order form</h2>
    <form @submit.prevent="submitForm" novalidate>
      <div class="field">
        <label>Name</label>
        <input type="text" v-model.trim="name" />
        <small class="error" v-if="errors.name">{{ errors.name }}</small>
      </div>

      <div class="field">
        <label>Product</label>
        <select v-model="product">
          <option value="">-- Select --</option>
          <option value="Widget A">Widget A</option>
          <option value="Widget B">Widget B</option>
          <option value="Widget C">Widget C</option>
        </select>
        <small class="error" v-if="errors.product">{{ errors.product }}</small>
      </div>

      <div class="field">
        <label>Date</label>
        <input type="date" v-model="date" />
        <small class="error" v-if="errors.date">{{ errors.date }}</small>
      </div>

      <div class="field">
        <label>Payment method</label>
        <div class="radio-group">
          <label><input type="radio" value="card" v-model="paymentMethod" /> Card</label>
          <label><input type="radio" value="paypal" v-model="paymentMethod" /> PayPal</label>
          <label><input type="radio" value="bank" v-model="paymentMethod" /> Bank transfer</label>
        </div>
        <small class="error" v-if="errors.paymentMethod">{{ errors.paymentMethod }}</small>
      </div>

      <div class="field">
        <label><input type="checkbox" v-model="agree" /> I accept terms</label>
        <small class="error" v-if="errors.agree">{{ errors.agree }}</small>
      </div>

      <button :disabled="submitting" type="submit">Submit</button>
      <small class="success" v-if="successMsg">{{ successMsg }}</small>
      <small class="error" v-if="errors.form">{{ errors.form }}</small>
    </form>
  </section>
</template>

<style scoped>
.field { margin-bottom: 1rem; display: flex; flex-direction: column; }
label { font-weight: 600; margin-bottom: 0.25rem; }
input[type="text"], select, input[type="date"] { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
.radio-group { display: flex; gap: 1rem; }
button { padding: 0.6rem 1rem; border: none; background: #2d6cdf; color: white; border-radius: 4px; cursor: pointer; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
.error { color: #b00020; }
.success { color: #0b7; }
</style>
