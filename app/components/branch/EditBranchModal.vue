<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import z from "zod";
import { useBranch } from "~/composables/api/v1/useBranch";
import { useBranchForm } from "~/composables/api/v1/useBranchForm";
import FieldError from "../ui/field/FieldError.vue";
import FieldGroup from "../ui/field/FieldGroup.vue";
import FieldSet from "../ui/field/FieldSet.vue";
import Spinner from "../ui/spinner/Spinner.vue";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const props = defineProps<{
  id: number | null;
  open: boolean;
  isDisabled: {
    type: boolean;
    default: false;
  };
}>();
const emit = defineEmits(["update:open", "success"]);

const {
  form,
  loadBranch,
  updateBranch,
  isSubmitting,
  isSuccess,
  isLoading,
  errorRes,
} = useBranchForm();
const { refresh } = useBranch();

// Schema
const BranchSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Email is invalid"),
  phone: z.string().min(1, "Phone is required"),
  is_active: z.boolean(),
});

// Init vee-validate
const { handleSubmit, resetForm, setFieldError, values, errors } = useForm({
  validationSchema: toTypedSchema(BranchSchema),
});

// Bind each field
const { value: id } = useField<number>("id");
const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: code, errorMessage: codeError } = useField<string>("code");
const { value: address, errorMessage: addressError } = useField<string>("address");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: phone, errorMessage: phoneError } = useField<string>("phone");
const { value: is_active, errorMessage: isActiveError } = useField<boolean>("is_active");

// Load initial values when modal open
watch(
  () => props.open,
  async (val) => {
    if (val && props.id) {
      await loadBranch(props.id);
      resetForm({
        values: {
          id: props.id,
          name: form.name,
          code: form.code,
          address: form.address,
          email: form.email,
          phone: form.phone,
          is_active: form.is_active,
        },
      });
    }
  }
);

// Form Submit
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    if (form.id == null) {
      // Ensure id is present before calling updateBranch
      toast.error("Branch ID is missing.", {
        description: "Cannot update branch without ID.",
      });
    }

    await updateBranch(values);

    if (isSuccess.value) {
      emit("update:open", false);
      refresh();
    } else {
      if (errorRes.value.data.code === 422) {
        const fieldErrors = errorRes.value.data.errors;

        fieldErrors.forEach((error: any) => {
          const field = error.field;
          const message = error.message;

          // Set to vee-validate error bag
          setFieldError(field, message);
        });
      }
    }
  } catch (error) {
    console.error("Error updating branch:", error);
    toast.error("Gagal memperbarui cabang", {
      description: "Terjadi kesalahan saat memperbarui data cabang.",
    });
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div>
    <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="text-left"> Edit Cabang </DialogTitle>
        </DialogHeader>

        <form v-if="!isLoading" class="space-y-4" @submit.prevent="onSubmit">
          <!-- Name -->
          <div class="grid gap-1">
            <Label>Nama</Label>
            <Input
              v-model="name"
              :disabled="props.isDisabled"
              placeholder="Contoh: Parongpong"
            />
            <p v-if="errors.name" class="text-xs text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Code -->
          <div class="grid gap-1">
            <Label>Kode</Label>
            <Input v-model="code" placeholder="Kode unik" />
            <p v-if="errors.code" class="text-xs text-red-500">
              {{ errors.code }}
            </p>
          </div>

          <!-- Email -->
          <div class="grid gap-1">
            <Label>Email</Label>
            <Input v-model="email" placeholder="email@example.com" />
            <p v-if="errors.email" class="text-xs text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone -->
          <div class="grid gap-1">
            <Label>Phone</Label>
            <Input v-model="phone" placeholder="0812..." />
            <p v-if="errors.phone" class="text-xs text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Address -->
          <div class="grid gap-1">
            <Label>Address</Label>
            <Textarea v-model="address" placeholder="Alamat lengkap" />
            <p v-if="errors.address" class="text-xs text-red-500">
              {{ errors.address }}
            </p>
          </div>

          <!-- is_active -->
          <div class="grid gap-1">
            <Label>Status</Label>
            <Select v-model="is_active">
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem :value="true">Aktif</SelectItem>
                <SelectItem :value="false">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.is_active" class="text-xs text-red-500">
              {{ errors.is_active }}
            </p>
          </div>

          <DialogFooter v-if="!props.isDisabled">
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
          </DialogFooter>
        </form>
        <div v-else class="py-10 text-center">
          <Spinner class="w-6 h-6 animate-spin mx-auto" />
          <p class="text-sm text-muted-foreground mt-2">Loading...</p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
