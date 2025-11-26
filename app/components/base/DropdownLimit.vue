<Select v-model="branch.limit">
  <SelectTrigger class="w-20">
    <SelectValue placeholder="Limit" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem :value="5">5</SelectItem>
    <SelectItem :value="10">10</SelectItem>
    <SelectItem :value="25">25</SelectItem>
    <SelectItem :value="50">50</SelectItem>
  </SelectContent>
</Select>
