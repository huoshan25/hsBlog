<script setup lang="ts">
import {SearchOutline} from "@vicons/ionicons5"
import {useSearchHistory} from "~/components/blog/navbar/hook/useSearchHistory"
import {useSearch} from "~/components/blog/navbar/hook/useSearch"

const {addSearchHistory, clearSearchHistory, getSearchHistory} = useSearchHistory()

const {
  searchInput,
  showDropdown,
  searchPlaceholder,
  inputStyle,
  dropdownContent,
  onFocusInput,
  onBlurInput,
  handleInput,
  handleKeyUp,
  performSearch,
  selectItem
} = useSearch(getSearchHistory, addSearchHistory)

const handleSearch = () => {
  performSearch()
}
</script>

<template>
  <div flex items-center class="search-container">
    <n-input-group>
      <n-input
          maxlength="64"
          :on-focus="onFocusInput"
          :on-blur="onBlurInput"
          :style="{ width: inputStyle.width , transition: 'width .1s linear 0s' }"
          :placeholder="searchPlaceholder"
          v-model:value="searchInput"
          @input="handleInput"
          @keyup="handleKeyUp"
      />
      <n-button :color="inputStyle.btColor" @click="handleSearch">
        <template #icon>
          <n-icon :color="inputStyle.iconColor">
            <SearchOutline/>
          </n-icon>
        </template>
      </n-button>
    </n-input-group>
    <div v-if="showDropdown && dropdownContent.length" class="search-dropdown">
      <div v-if="!searchInput" class="flex p-[10px] border-b-[1px] border-b-solid border-[#e5e6ecff]">
        <div class="color-#8a919f flex-1">搜索记录</div>
        <n-button class="flex-4" text type="info" size="small" @mousedown.stop="clearSearchHistory">
          清空
        </n-button>
      </div>
      <div v-for="(item, index) in dropdownContent" :key="index" class="dropdown-item"
           @mousedown="selectItem(item)">
        {{ item }}
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.search-container {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e4e6eb;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>