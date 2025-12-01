<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";
import z from "zod";
import { useBranch } from "~/composables/api/v1/useBranch";
import { useBranchForm } from "~/composables/api/v1/useBranchForm";
import Spinner from "../ui/spinner/Spinner.vue";

const props = defineProps<{ id: number | null; open: boolean }>();
const emit = defineEmits(["update:open", "success"]);

const { form, loadBranch, updateBranch, isSubmitting, isSuccess, isLoading } = useBranchForm();
const { refresh } = useBranch();

// Schema
const BranchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().min(1, "Address is required"),
});

// Init vee-validate
const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(BranchSchema),
});

// Bind each field
const { value: name, errorMessage: nameError } = useField("name");
const { value: code, errorMessage: codeError } = useField("code");
const { value: address, errorMessage: addressError } = useField("address");

// Load initial values when modal open
watch(
  () => props.open,
  async (val) => {
    if (val && props.id) {
      await loadBranch(props.id);
      console.log("Loaded branch for editing:", form);
      resetForm({
        values: {
          name: form.name,
          code: form.code,
          address: form.address,
        },
      });
    }
  }
);

// Form Submit
const onSubmit = handleSubmit(async (values) => {
  form.name = values.name;
  form.code = values.code;
  form.address = values.address;

  await updateBranch(form.id, form);

  if (isSuccess.value) {
    console.log("Branch updated successfully");
    emit("success");
  }

  // emit("success");
  emit("update:open", false);
  props.open = !props.open;
});
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Branch</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="onSubmit" v-if="!isLoading" >
        <div>
          <Label>Name</Label>
          <Input v-model="name" />
          <p class="text-red-500 text-sm">{{ nameError }}</p>
        </div>

        <div>
          <Label>Code</Label>
          <Input v-model="code" />
          <p class="text-red-500 text-sm">{{ codeError }}</p>
        </div>

        <div>
          <Label>Address</Label>
          <Textarea v-model="address" />
          <p class="text-red-500 text-sm">{{ addressError }}</p>
        </div>

        <div class="flex justify-end">
          <Button
            type="button"
            variant="outline"
            class="mr-2"
            @click="emit('update:open', false)"
          >
            Cancel
          </Button>

          <Button type="submit" :disabled="isSubmitting">
            <Spinner v-if="isSubmitting" class="mr-2 animate-spin" />
            Update
          </Button>
        </div>
      </form>
      <div v-else class="py-10 text-center">
        <Spinner class="w-6 h-6 animate-spin mx-auto" />
        <p class="text-sm text-muted-foreground mt-2">
          Loading...
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
