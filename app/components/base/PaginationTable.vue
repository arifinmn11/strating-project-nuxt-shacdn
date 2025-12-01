<script setup lang="ts">
const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
});

const emit = defineEmits(["change"]);

/**
 * Generate small pagination window
 */
const pages = computed(() => {
  const maxButtons = 5;
  let start = Math.max(1, props.currentPage - 2);
  let end = Math.min(props.lastPage, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function goTo(page) {
  if (page < 1 || page > props.lastPage) return;
  emit("change", page);
}
</script>

<template>
  <div class="flex items-center gap-2 mt-4">
    <!-- Prev -->
    <button
      class="px-3 py-1 border rounded disabled:opacity-40"
      :disabled="currentPage === 1"
      @click="goTo(currentPage - 1)"
    >
      Prev
    </button>

    <!-- Page numbers -->
    <button
      v-for="page in pages"
      :key="page"
      class="px-3 py-1 border rounded"
      @click="goTo(page)"
    >
      {{ page }}
    </button>

    <!-- Next -->
    <button
      class="px-3 py-1 border rounded disabled:opacity-40"
      :disabled="currentPage === lastPage"
      @click="goTo(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>
