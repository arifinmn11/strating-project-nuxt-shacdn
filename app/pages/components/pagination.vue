<script setup lang="ts">
import { ArrowUpLeftIcon, ArrowUpRightIcon } from 'lucide-vue-next'

const items = ref([
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Pagination', href: '/components/pagination' },
])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Pagination</h2>
        <p class="text-muted-foreground">
          Displays data in paged format and provides navigation between pages.
        </p>
      </div>
      <div class="flex gap-2">
        <Badge variant="secondary" class="rounded-full" as-child>
          <NuxtLink
            to="https://www.shadcn-vue.com/docs/components/pagination"
            external
            target="_blank"
          >
            Component Source
            <ArrowUpRightIcon class="inline w-4 h-4 ml-1" />
          </NuxtLink>
        </Badge>
        <Badge variant="secondary" class="rounded-full" as-child>
          <NuxtLink
            to="https://www.reka-ui.com/docs/components/pagination"
            external
            target="_blank"
          >
            API Reference
            <ArrowUpLeftIcon class="inline w-4 h-4 ml-1" />
          </NuxtLink>
        </Badge>
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Basic</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            class="min-h-100px w-full flex items-center justify-center gap-4 md:min-h-200px"
          >
            <Pagination
              v-slot="{ page }"
              :total="100"
              :sibling-count="1"
              show-edges
              :default-page="2"
            >
              <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                  <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                  >
                    <Button
                      class="h-9 w-9 p-0"
                      :variant="item.value === page ? 'default' : 'outline'"
                    >
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />
              </PaginationList>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>
