<script setup lang="ts">
import { useNuxtApp } from '#app'
import { toTypedSchema } from '@vee-validate/zod'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useBranch } from '~/composables/api/v1/useBranch'
import { useBranchForm } from '~/composables/api/v1/useBranchForm'
import { branchService } from '~/services/api/v1/branchService'

// Types
interface BranchFormData {
  name: string
  code: string
  email: string
  phone: string
  address: string
  is_active: boolean
}

// Props & Emits
interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<Emits>()

// Validation Schema
const branchSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    code: z.string().min(1, 'Kode wajib diisi'),
    email: z.string().email('Email tidak valid').or(z.literal('')).optional(),
    phone: z.string().min(1, 'Nomor telepon wajib diisi'),
    address: z.string().optional(),
    is_active: z.boolean().default(true),
  }),
)

// Form Setup
const { handleSubmit, resetForm, setFieldValue, setFieldError } = useForm<BranchFormData>({
  validationSchema: branchSchema,
  initialValues: {
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    is_active: true,
  },
})

// Services & State
const { refresh } = useBranch()
const {
  form,
  loadBranch,
  createBranch,
  isSubmitting,
  isSuccess,
  isLoading,
  errorRes,
} = useBranchForm()
const submitting = ref(false)

// Handlers
const onSubmit = handleSubmit(async (values) => {
  console.log('Creating branch with values:', values)
  await createBranch(values)
  if (isSuccess.value) {
    emit('success')
    await refresh()
  }
  else {
    if (errorRes.value.data.code === 422) {
      const fieldErrors = errorRes.value.data.errors

      fieldErrors.forEach((error: any) => {
        const field = error.field
        const message = error.message

        // Set to vee-validate error bag
        setFieldError(field, message)
      })
    }
  }
})

function handleClose() {
  emit('update:open', false)
  resetForm()
}

// Watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Tambah Cabang</DialogTitle>
        <DialogDescription>
          Tambahkan data cabang baru ke dalam sistem.
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit="onSubmit">
        <!-- Name Field -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nama</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Contoh: Parongpong"
                autocomplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Code Field -->
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormLabel>Kode</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="Kode unik cabang"
                autocomplete="off"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email Field -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                placeholder="email@example.com"
                autocomplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Phone Field -->
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Nomor Telepon</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="0812..." autocomplete="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Address Field -->
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Alamat lengkap cabang"
                rows="3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Status Field -->
        <FormField v-slot="{ componentField }" name="is_active">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              v-bind="componentField"
              @update:model-value="(val) => setFieldValue('is_active', val)"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem :value="true">
                  Aktif
                </SelectItem>
                <SelectItem :value="false">
                  Tidak Aktif
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            :disabled="submitting"
            @click="handleClose"
          >
            Batal
          </Button>

          <Button type="submit" :disabled="submitting">
            <Loader2 v-if="submitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ submitting ? "Menyimpan..." : "Simpan" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
