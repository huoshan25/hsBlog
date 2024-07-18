import {CreateOutline, SpeedometerOutline, GitNetwork, PersonSharp} from "@vicons/ionicons5";
import {type MenuOption, NIcon} from "naive-ui";
import type {Component} from "vue";

/**转换图标*/
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, {default: () => h(icon)})
}

/**
 * 后台菜单配置
 */
export const useMenus = () => {

  /**菜单项*/
  const menuOptions = useState<MenuOption[]>('menuOptions', () => {
    return [
      {
        label: '仪表盘',
        key: '/admin',
        icon: renderIcon(SpeedometerOutline),
      },
      {
        label: '文章管理',
        key: '/admin/articleEditor',
        icon: renderIcon(CreateOutline),
      },
      {
        label: '分类管理',
        key: '/admin/categoryManage',
        icon: renderIcon(GitNetwork),
      },
      {
        label: '关于管理',
        key: '/admin/profileManage',
        icon: renderIcon(PersonSharp),
      },
    ]
  })

  return {
    menuOptions
  }
}