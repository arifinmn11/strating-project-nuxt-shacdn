<script setup lang="ts">
import TableWithPagination from "~/components/base/TableWithPagination.vue";
import type { columns } from "~/components/tasks/components/columns";
import { useBranch } from "~/composables/api/v1/useBranch";

const {
  // state
  page,
  limit,
  search,
  // unused in this view for now
  // data
  branches,
  pagination,
  pending,
  error,
  // actions
} = useBranch();

function handlePageChange(p: number) {
  page.value = p;
  console.log("Page changed to:", p);
}
function handleLimitChange(l: number) {
  limit.value = l;
  page.value = 1; // reset to first page on limit change
}

function handleSortChange(sortKey: string) {
  console.log("Sort changed to:", sortKey);
}

function handleSearchChange(searchTerm: string) {
  search.value = searchTerm;
  page.value = 1; // reset to first page on search change
}
</script>

<template>
  <div class="space-y-4">
    <!-- <div class="flex items-center gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search branches..."
        class="border px-3 py-2 rounded w-64"
      />
      <select v-model="limit" class="border px-3 py-2 rounded">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div v-if="pending" class="text-sm text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-sm text-red-600">Failed to load data</div>

    <table class="w-full border-collapse">
      <thead>
        <tr class="text-left border-b">
          <th class="p-2">#</th>
          <th class="p-2">Name</th>
          <th class="p-2">Email</th>
          <th class="p-2">Phone</th>
          <th class="p-2">Address</th>
          <th class="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(b, idx) in branches" :key="b.id" class="border-b">
          <td class="p-2">
            {{ (pagination?.current_page - 1) * limit + idx + 1 }}
          </td>
          <td class="p-2">
            {{ b.name }}
          </td>
          <td class="p-2">
            {{ b.email }}
          </td>
          <td class="p-2">
            {{ b.phone }}
          </td>
          <td class="p-2">
            {{ b.address }}
          </td>
          <td class="p-2">
            <span :class="b.is_active ? 'text-green-600' : 'text-gray-500'">
              {{ b.is_active ? "Active" : "Inactive" }}
            </span>
          </td>
        </tr>
        <tr v-if="branches.length === 0">
          <td class="p-4 text-center text-gray-500" colspan="6">No data</td>
        </tr>
      </tbody>
    </table> -->

    <TableWithPagination
      :data="branches"
      :columns="[
        { key: 'id', label: '#', columns },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'address', label: 'Address' },
        { key: 'is_active', label: 'Status' },
      ]"
      :pagination="pagination"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange"
      @search-change="handleSearchChange"
      @sort-change="handleSortChange"
    >
    </TableWithPagination>
  </div>
</template>
