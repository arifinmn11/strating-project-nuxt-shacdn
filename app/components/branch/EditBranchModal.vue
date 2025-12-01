<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import z from 'zod'
import { useBranch } from '~/composables/api/v1/useBranch'
import { useBranchForm } from '~/composables/api/v1/useBranchForm'
import FieldError from '../ui/field/FieldError.vue'
import FieldGroup from '../ui/field/FieldGroup.vue'
import FieldSet from '../ui/field/FieldSet.vue'
import Spinner from '../ui/spinner/Spinner.vue'
import { toast } from 'vue-sonner'

const props = defineProps<{ id: number | null, open: boolean }>()
const emit = defineEmits(['update:open', 'success'])

const {
  form,
  loadBranch,
  updateBranch,
  isSubmitting,
  isSuccess,
  isLoading,
  errorRes,
} = useBranchForm()
const { refresh } = useBranch()

// Schema
const BranchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Email is invalid'),
  phone: z.string().min(1, 'Phone is required'),
  is_active: z.boolean(),
})

// Init vee-validate
const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: toTypedSchema(BranchSchema),
})

// Bind each field
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: code, errorMessage: codeError } = useField<string>('code')
const { value: address, errorMessage: addressError } = useField<string>('address')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')
const { value: is_active, errorMessage: isActiveError } = useField<boolean>('is_active')

// Load initial values when modal open
watch(
  () => props.open,
  async (val) => {
    if (val && props.id) {
      await loadBranch(props.id)
      resetForm({
        values: {
          name: form.name,
          code: form.code,
          address: form.address,
          email: form.email,
          phone: form.phone,
          is_active: form.is_active,
        },
      })
    }
  },
)

// Form Submit
const onSubmit = handleSubmit(async (values) => {
  form.name = values.name
  form.code = values.code
  form.address = values.address
  form.email = values.email
  form.phone = values.phone
  form.is_active = values.is_active

  if (form.id == null) {
    // Ensure id is present before calling updateBranch
    toast.error('Branch ID is missing.', { description: 'Cannot update branch without ID.' })
  }

  await updateBranch(form)

  if (isSuccess.value) {
    emit('update:open', false)
    refresh()
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
</script>

<template>
  <div>
    <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="text-left">
            Edit Cabang
          </DialogTitle>
        </DialogHeader>

        <form v-if="!isLoading" class="space-y-4" @submit.prevent="onSubmit">
          <FieldGroup>
            <FieldSet>
              <FieldDescription>
                Please update the branch information below.
              </FieldDescription>
              <Field>
                <FieldLabel aria-required="true" for="name">
                  Name
                </FieldLabel>
                <Input id="name" v-model="name" required autocomplete="off" />
                <FieldError>{{ nameError }}</FieldError>
              </Field>

              <Field>
                <FieldLabel aria-required="true" for="code">
                  Code
                </FieldLabel>
                <Input id="code" v-model="code" required autocomplete="off" />
                <FieldError>{{ codeError }}</FieldError>
              </Field>

              <Field>
                <FieldLabel aria-required="true" for="address">
                  Address
                </FieldLabel>
                <Textarea id="address" v-model="address" required autocomplete="off" />
                <FieldError>{{ addressError }}</FieldError>
              </Field>
              <Field>
                <FieldLabel aria-required="true" for="email">
                  Email
                </FieldLabel>
                <Input id="email" v-model="email" required autocomplete="off" />
                <FieldError>{{ emailError }}</FieldError>
              </Field>
              <Field>
                <FieldLabel aria-required="true" for="phone" class="">
                  Phone
                </FieldLabel>
                <Input id="phone" v-model="phone" required autocomplete="off" />
                <FieldError>{{ phoneError }}</FieldError>
              </Field>

              <Field class="right-0">
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox id="is_active" v-model="is_active" :default-value="true" />
                    <FieldLabel for="is_active" class="font-normal">
                      Active
                    </FieldLabel>
                    <FieldError>{{ isActiveError }}</FieldError>
                  </Field>
                </FieldGroup>
              </Field>

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
            </FieldSet>
          </FieldGroup>
        </form>
        <div v-else class="py-10 text-center">
          <Spinner class="w-6 h-6 animate-spin mx-auto" />
          <p class="text-sm text-muted-foreground mt-2">
            Loading...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
