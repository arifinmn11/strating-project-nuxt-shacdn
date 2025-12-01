<script setup lang="ts">
import { useNuxtApp } from '#app'
import { toTypedSchema } from '@vee-validate/zod'
import { Loader2 } from 'lucide-vue-next'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
/* shadcn components (assume auto-import or adjust imports) */
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { branchService } from '~/services/api/v1/branchService'

/* Props / Emits */
const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['update:open', 'success'])

/* Zod schema */
const branchSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  code: z.string().min(1, 'Kode wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  // is_active we store as boolean on backend but select returns "1"/"0"
  is_active: z.union([z.literal('1'), z.literal('0')]),
})

/* vee-validate form using zod resolver */
const { handleSubmit, errors, values, resetForm } = useForm({
  validationSchema: toTypedSchema(branchSchema),
})

/* fields (not mandatory if using v-model values) */
const { value: name } = useField('name')
const { value: code } = useField('code')
const { value: email } = useField('email')
const { value: phone } = useField('phone')
const { value: address } = useField('address')
const { value: is_active } = useField('is_active')

/* convert select string <-> stored type */
const isActiveModel = computed({
  get: () => String(values.is_active ?? '1'),
  set: (v: string) => (values.is_active = v),
})

/* Service */
const { $api } = useNuxtApp()
const service = branchService($api)

const submitting = ref(false)

const onSubmit = handleSubmit(async (formValues) => {
  submitting.value = true
  try {
    // convert to what backend expects (boolean) if needed
    const payload = {
      ...formValues,
      is_active: formValues.is_active === '1', // or keep string if backend expects '1'/'0'
    }

    await service.storeBranch(payload) // assumes storeBranch handles POST /v1/branch

    // success -> emit to parent so it can refresh list
    emit('success')
    emit('update:open', false)
    resetForm()
  }
  catch (err: any) {
    // handle api errors (you can map errors to errors object)
    console.error(err)
    // Optionally show toast or set field errors
  }
  finally {
    submitting.value = false
  }
})

/* optional: when modal opens, reset form */
watch(() => props.open, (v) => {
  if (v)
    resetForm({ values: { is_active: '1' } })
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg w-full">
      <DialogHeader>
        <DialogTitle>Tambah Cabang</DialogTitle>
        <DialogDescription>Tambahkan data cabang baru.</DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- Name -->
        <div class="grid gap-1">
          <Label>Nama</Label>
          <Input v-model="values.name" placeholder="Contoh: Parongpong" />
          <p v-if="errors.name" class="text-xs text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <!-- Code -->
        <div class="grid gap-1">
          <Label>Kode</Label>
          <Input v-model="values.code" placeholder="Kode unik" />
          <p v-if="errors.code" class="text-xs text-red-500">
            {{ errors.code }}
          </p>
        </div>

        <!-- Email -->
        <div class="grid gap-1">
          <Label>Email</Label>
          <Input v-model="values.email" placeholder="email@example.com" />
          <p v-if="errors.email" class="text-xs text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Phone -->
        <div class="grid gap-1">
          <Label>Phone</Label>
          <Input v-model="values.phone" placeholder="0812..." />
          <p v-if="errors.phone" class="text-xs text-red-500">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Address -->
        <div class="grid gap-1">
          <Label>Address</Label>
          <Textarea v-model="values.address" placeholder="Alamat lengkap" />
          <p v-if="errors.address" class="text-xs text-red-500">
            {{ errors.address }}
          </p>
        </div>

        <!-- is_active -->
        <div class="grid gap-1">
          <Label>Status</Label>
          <Select v-model="isActiveModel">
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                Aktif
              </SelectItem>
              <SelectItem value="0">
                Tidak Aktif
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.is_active" class="text-xs text-red-500">
            {{ errors.is_active }}
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('update:open', false)">
            Batal
          </Button>

          <Button type="submit" :disabled="submitting">
            <span v-if="submitting" class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              Menyimpan...
            </span>
            <span v-else>Simpan</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
