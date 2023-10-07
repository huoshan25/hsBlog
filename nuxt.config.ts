// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { 
    enabled: true 
  },

  modules: [
    '@ant-design-vue/nuxt'
  ],

  antd:{
    // Options
  },

  // 为了更好的类型提示
  // typescript: {
	// 	shim: false
	// },

})


