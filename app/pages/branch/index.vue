<script setup lang="ts">
import { boolean } from "zod";
import PaginationTable from "~/components/base/PaginationTable.vue";
import AddBranchModal from "~/components/branch/AddBranchModal.vue";
import EditBranchModal from "~/components/branch/EditBranchModal.vue";
import Skeleton from "~/components/ui/skeleton/Skeleton.vue";
import { useBranch } from "~/composables/api/v1/useBranch";

const isOpenCreateModal = ref(false);
const isOpenEditModal = ref(false);
const editingBranchId = ref<number | null>(null);
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

function handleBtnEdit(id: number, isShow: boolean) {
  console.log("Edit branch with ID:", id);
  isOpenEditModal.value = isShow;
  editingBranchId.value = id;
}

function handleBtnDelete(id: number) {
  console.log("Delete branch with ID:", id);
}

function openAddBranchModal(isShow: boolean) {
  isOpenCreateModal.value = isShow;
}

const onAdded = () => {
  // refresh list after new branch added
  // refresh();
};

const onEdited = () => {
  // refresh list after branch edited
  // refresh();
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <Input v-model="search" placeholder="Search branch..." class="w-64" />

      <Button variant="outline" @click="openAddBranchModal(true)">Tambah Cabang</Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead @click="handleSortChange('id|asc')">ID</TableHead>
          <TableHead @click="handleSortChange('name|asc')">Name</TableHead>
          <TableHead @click="handleSortChange('code|asc')">Code</TableHead>
          <TableHead @click="handleSortChange('address|asc')">Address</TableHead>
          <TableHead @click="handleSortChange('email|asc')">Email</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="pending">
          <TableRow v-for="n in 5" :key="n">
            <TableCell class="text-center" v-for="s in 6" :key="s">
              <Skeleton class="h-4 w-[250px]" />
            </TableCell>
          </TableRow>
        </template>

        <TableRow
          v-for="item in branches"
          v-else-if="branches.length > 0 && !pending"
          :key="item.id"
        >
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.code }}</TableCell>
          <TableCell>{{ item.address }}</TableCell>
          <TableCell>{{ item.email }}</TableCell>

          <TableCell>
            <div class="flex gap-2">
              <Button
                @click="
                  () => {
                    console.log('Edit clicked for ID:', item.id);
                    handleBtnEdit(item.id, true);
                  }
                "
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
              <Button
                @click="() => handleBtnDelete(item.id)"
                variant="outline"
                size="sm"
                class="text-red-600"
              >
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>

        <TableRow v-else>
          <TableCell colspan="3" class="text-center"> No Data </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex justify-between items-center">
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

    <AddBranchModal v-model:open="isOpenCreateModal" @success="onAdded" />
    <EditBranchModal
      v-model:open="isOpenEditModal"
      :id="editingBranchId"
      @success="onEdited"
    />
  </div>
</template>
