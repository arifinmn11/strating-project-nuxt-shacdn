<script setup lang="ts">
import type { columns } from "~/components/tasks/components/columns";
import TableWithPagination from "~/components/base/TableWithPagination.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBranch } from "~/composables/api/v1/useBranch";
import { EyeIcon, MoreHorizontal, SquarePen } from "lucide-vue-next";
import { Button } from "~/components/ui/button";
import EditBranchModal from "~/components/branch/EditBranchModal.vue";
import AddBranchModal from "~/components/branch/AddBranchModal.vue";

const isOpenCreateModal = ref(false);
const isOpenEditModal = ref(false);
const editingBranchId = ref<number | null>(null);
const isOpenDropdown = ref(false);
const isDisabledForm = ref(false);

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

  // actions
} = useBranch();

function handlePageChange(p: number) {
  page.value = p;
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

function handleDeleteById(item: any) {
  console.log("Delete item:", item);
}

function handleEditById(item: any, isDisabled = false) {
  editingBranchId.value = item;
  isOpenEditModal.value = true;
  isDisabledForm.value = isDisabled;
}
</script>

<template>
  <div class="space-y-4">
    <TableWithPagination
      :data="branches"
      :loading="pending"
      :columns="[
        { key: 'id', label: '#' },
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
      <template #actions="{ item }">
        <div class="flex gap-2">
          <DropdownMenu v-model="isOpenDropdown">
            <DropdownMenuTrigger as-child>
              <MoreHorizontal class="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="handleEditById(item.id)"> Edit </DropdownMenuItem>
              <DropdownMenuItem @click="handleDeleteById(item.id)">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="outline"
                  size="sm"
                  @click="handleEditById(item.id, true)"
                >
                  <EyeIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </template>
    </TableWithPagination>

    <AddBranchModal v-model:open="isOpenCreateModal" />
    <EditBranchModal
      v-model:open="isOpenEditModal"
      :id="editingBranchId"
      :isDisabled="isDisabledForm"
    />
  </div>
</template>
