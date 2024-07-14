import {CreateOutline, SpeedometerOutline} from "@vicons/ionicons5";
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
    ]
  })

  return {
    menuOptions
  }
}