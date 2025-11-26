<script setup lang="ts">
import PaginationTable from "~/components/base/PaginationTable.vue";
import { useBranch } from "~/composables/api/v1/useBranch";

const {
  branches,
  pagination,
  pending,
  page,
  limit,
  search,
  sort_by,
  filters,
  next,
  prev,
} = useBranch();

function handlePageChange(newPage: number) {
  page.value = newPage;
}

function handleSortChange(newSortBy: string) {
  if (sort_by.value === newSortBy) {
    sort_by.value = "";
  } else {
    sort_by.value = newSortBy;
  }
}
</script>

<template>
  <div class="space-y-4">
    <Input v-model="search" placeholder="Search branch..." class="w-64" />
   
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead @click="handleSortChange('id|asc')">ID</TableHead>
          <TableHead @click="handleSortChange('name|asc')">Name</TableHead>
          <TableHead @click="handleSortChange('email|asc')">Email</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-for="item in branches" v-if="branches.length" :key="item.id">
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.email }}</TableCell>
        </TableRow>

        <TableRow v-else>
          <TableCell colspan="3" class="text-center"> No Data </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex justify-between items-center">
      <!-- <Button @click="prev" :disabled="page <= 1">Prev</Button>

      <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

      <Button @click="next" :disabled="pagination.current_page >= pagination.last_page">
        Next
      </Button> -->

      <Select v-model="limit">
        <SelectTrigger class="w-20">
          <SelectValue placeholder="Limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1"> 1 </SelectItem>
          <SelectItem value="25"> 25 </SelectItem>
          <SelectItem value="50"> 50 </SelectItem>
        </SelectContent>
      </Select>

      <PaginationTable
        :current-page="pagination.current_page"
        :last-page="pagination.last_page"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
