<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { API_BASE } from '../api';

const items = ref<any[]>([]);
const query = ref('');
const formIdFilter = ref('');
const page = ref(1);
const pageSize = 10;
const lastUpdated = ref<string|null>(null);

async function load() {
  const url = new URL(`${API_BASE}/submissions`);
  url.searchParams.set('limit', '1000');
  const res = await fetch(url.toString());
  items.value = await res.json();
  lastUpdated.value = new Date().toISOString();
}

let intervalId: any;
onMounted(() => {
  load();
  intervalId = setInterval(load, 10000);
});
onUnmounted(() => clearInterval(intervalId));

const filtered = computed(() =>
  items.value.filter(s => {
    const text = JSON.stringify(s).toLowerCase();
    const q = query.value.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesForm = !formIdFilter.value || s.formId === formIdFilter.value;
    return matchesQuery && matchesForm;
  })
);

const paged = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});

function onSearch() { page.value = 1; }
function next() { if (page.value * pageSize < filtered.value.length) page.value++; }
function prev() { if (page.value > 1) page.value--; }
</script>

<template>
  <section>
    <h2>Submissions</h2>

    <div class="toolbar">
      <input
        v-model.trim="query"
        type="text"
        placeholder="Search (any field)"
        @input="onSearch"
      />
      <select v-model="formIdFilter" @change="onSearch">
        <option value="">All forms</option>
        <option value="order-form-v1">Order Form</option>
      </select>
      <button @click="load">Refresh</button>
    </div>

    <p class="muted">
      Last updated: {{ lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'never' }}
    </p>

    <table class="table">
      <thead>
        <tr>
          <th>Form ID</th>
          <th>Submitted At</th>
          <th>Data (flattened)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in paged" :key="s.id">
          <td>{{ s.formId }}</td>
          <td>{{ new Date(s.submittedAt).toLocaleString() }}</td>
          <td>
            <div class="kv" v-for="(val, key) in s.data" :key="key">
              <span class="k">{{ key }}</span>: <span class="v">{{ val }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <button @click="prev">Prev</button>
      <span>Page {{ page }}</span>
      <button @click="next">Next</button>
      <span>({{ filtered.length }} items)</span>
    </div>
  </section>
</template>

<style scoped>
.toolbar { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
input, select { padding: 0.4rem; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 0.4rem 0.8rem; border: none; background: #444; color: white; border-radius: 4px; }
button:hover { opacity: 0.9; }
.muted { color: #777; }
.table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; vertical-align: top; }
thead { background: #000000; }
.kv { margin-bottom: 0.25rem; }
.k { font-weight: 600; }
.pager { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
</style>
