import {generate} from '@ant-design/colors'
import type {Ref} from "vue";
import type {GlobalThemeOverrides} from "naive-ui";

type MainColor = Ref<string>;

/*主题色覆盖*/
export function useThemeOverrides(mainColor: MainColor): GlobalThemeOverrides {
  const generateColors = generate(mainColor.value)
  return {
    common: {
      primaryColor: generateColors[5],
      primaryColorHover: generateColors[4],
      primaryColorSuppl: generateColors[4],
      primaryColorPressed: generateColors[6]
    },
    Button: {
      buttonColor: generateColors[5],
      buttonColorHover: generateColors[4],
      buttonColorSuppl: generateColors[4],
      buttonColorPressed: generateColors[6]
    }
  }
}