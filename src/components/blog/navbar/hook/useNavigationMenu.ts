export interface NavigationMenu {
  title: string
  url: string
}

/**
 * 导航栏菜单hook
 */
export const useNavigationMenu = () => {
  const menuOptions = ref<NavigationMenu[]>(
    [
      {
        title: '首页',
        url: '/blog'
      },
      {
        title: '关于',
        url: '/blog/profile'
      },
      {
        title: '友链',
        url: '/blog/friendChains'
      },
    ]
  )

  const getMenuOptions = computed(() => menuOptions.value)

  return {
    getMenuOptions
  }
}
