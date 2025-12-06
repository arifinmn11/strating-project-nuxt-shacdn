<script setup lang="ts">
import { ChevronLeftIcon, CircleChevronLeft } from "lucide-vue-next";
import Button from "../ui/button/Button.vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
});

const emit = defineEmits(["change"]);

// Generate a centered window of page numbers
const windowPages = computed<number[]>(() => {
  const maxButtons = 5;
  let start = Math.max(1, props.currentPage - 2);
  let end = Math.min(props.lastPage, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function goTo(page: number) {
  if (page < 1 || page > props.lastPage) return;
  emit("change", page);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- First -->
    <Button
      :variant="'outline'"
      :size="'sm'"
      class="px-3 py-1 disabled:opacity-40"
      :disabled="currentPage === 1"
      @click="goTo(1)"
    >
      First
    </Button>

    <!-- Prev -->
    <Button
      :variant="'outline'"
      :size="'sm'"
      class="px-3 py-1 disabled:opacity-40"
      :disabled="currentPage === 1"
      @click="goTo(currentPage - 1)"
    >
      <CircleChevronLeft />
      <span class="hidden sm:block">Prev</span>
    </Button>

    <!-- Leading edge: 1 and ellipsis if needed -->
    <template v-if="windowPages[0] > 1">
      <Button :variant="'outline'" :size="'sm'" class="px-3 py-1" @click="goTo(1)"
        >1</Button
      >
      <span v-if="windowPages[0] > 2" class="px-1">…</span>
    </template>

    <!-- Window page numbers -->
    <Button
      v-for="p in windowPages"
      :key="p"
      :variant="p === currentPage ? 'default' : 'outline'"
      :size="'sm'"
      class="px-3 py-1"
      @click="goTo(p)"
    >
      {{ p }}
    </Button>

    <!-- Trailing edge: ellipsis and last page if needed -->
    <template v-if="windowPages[windowPages.length - 1] < lastPage">
      <span v-if="windowPages[windowPages.length - 1] < lastPage - 1" class="px-1"
        >…</span
      >
      <Button
        :variant="'outline'"
        :size="'sm'"
        class="px-3 py-1 border rounded"
        @click="goTo(lastPage)"
      >
        {{ lastPage }}
      </Button>
    </template>

    <!-- Next -->
    <Button
      :variant="'outline'"
      :size="'sm'"
      class="px-3 py-1 disabled:opacity-40"
      :disabled="currentPage === lastPage"
      @click="goTo(currentPage + 1)"
    >
      Next
    </Button>

    <!-- Last -->
    <Button
      :variant="'outline'"
      :size="'sm'"
      class="px-3 py-1 border rounded disabled:opacity-40"
      :disabled="currentPage === lastPage"
      @click="goTo(lastPage)"
    >
      Last
    </Button>
  </div>
</template>
