<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import PaginationTable from "./PaginationTable.vue";
const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  pagination: { type: Object, required: false },
  sortBy: { type: String, required: false },
  limit: { type: Number, required: false },
  search: { type: String, required: false },
});
const emit = defineEmits(["pageChange", "sortChange", "limitChange"]);

function handleSortChange(key: string) {
  emit("sortChange", key);
}

function goTo(page: number) {
  if (!props.pagination) {
    return;
  }
  const last = props.pagination.last_page || 1;
  const target = Math.min(Math.max(1, page), last);
  emit("pageChange", target);
}

const windowPages = computed<number[]>(() => {
  const maxButtons = 5;
  let start = Math.max(1, props.pagination?.current_page - 2);
  let end = Math.min(props.pagination?.last_page, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const columnsList = computed(() => (props.columns || []) as any[]);
const dataList = computed(() => (props.data || []) as any[]);
</script>

<template>
  <div class="space-y-4 w-full">
    <!-- Limit selector -->

    <Input
      v-model="props.search"
      @update:model-value="$emit('searchChange', String($event))"
      placeholder="Search branch..."
      class="w-64"
    />

    <Table class="">
      <TableHeader>
        <TableRow>
          <TableHead>
            <slot name="actions-header"> No </slot>
          </TableHead>
          <TableHead
            v-for="(column, index) in columnsList"
            :key="index"
            class="cursor-pointer select-none"
            @click="handleSortChange(column.key)"
          >
            {{ column.label }}
          </TableHead>
          <!-- Actions header slot (optional) -->
          <TableHead v-if="$slots.actions">
            <slot name="actions-header"> Actions </slot>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, rowIndex) in dataList" :key="rowIndex">
          <TableCell>
            {{
              (props.pagination?.current_page - 1) *
                (props.pagination?.per_page ?? props.pagination?.items_per_page ?? 10) +
              rowIndex +
              1
            }}
          </TableCell>
          <TableCell v-for="(column, colIndex) in columnsList" :key="colIndex">
            <slot name="cell" :item="item" :column="column">
              {{ item[column.key] }}
            </slot>
          </TableCell>
          <!-- Actions cell slot (optional) -->
          <TableCell v-if="$slots.actions">
            <slot name="actions" :item="item" />
          </TableCell>
        </TableRow>
        <TableEmpty v-if="!dataList || dataList.length === 0" />
      </TableBody>
    </Table>
    <div v-if="props.pagination" class="flex justify-between gap-2">
      <div class="flex items-center gap-2">
        <label class="text-sm text-muted-foreground">Rows per page</label>
        <Select
          :model-value="
            props.limit ??
            props.pagination?.per_page ??
            props.pagination?.items_per_page ??
            10
          "
          @update:model-value="$emit('limitChange', Number($event))"
        >
          <SelectTrigger class="w-28">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="5"> 5 </SelectItem>
            <SelectItem :value="10"> 10 </SelectItem>
            <SelectItem :value="20"> 20 </SelectItem>
            <SelectItem :value="50"> 50 </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex justify-end">
        <PaginationTable
          :current-page="props.pagination.current_page"
          :last-page="props.pagination.last_page"
          @change="goTo"
        />
      </div>
    </div>
  </div>
</template>
