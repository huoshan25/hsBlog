<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  getArticleTrend,
  getArticleCategory,
  getArticleTimeDistribution,
  getArticleOverview,
  getArticleWords,
  getTagStats,
  getTagTrend
} from '~/api/admin/instrumentPanel'
import 'echarts-wordcloud'

definePageMeta({
  layout: 'admin',
})

/*引用DOM元素*/
const articleTrendRef = ref<HTMLElement | null>(null)
const categoryPieRef = ref<HTMLElement | null>(null)
const timeDistributionRef = ref<HTMLElement | null>(null)
const wordsDistributionRef = ref<HTMLElement | null>(null)
const tagCloudRef = ref<HTMLElement | null>(null)
const tagTrendRef = ref<HTMLElement | null>(null)

/*图表实例*/
let charts: { [key: string]: echarts.ECharts } = {}

/*数据概览*/
const overviewData = ref([
  { label: '文章总数', value: 0, desc: '所有文章数量' },
  { label: '已发布', value: 0, desc: '已发布的文章数量' },
  { label: '草稿箱', value: 0, desc: '草稿状态的文章数量' },
  { label: '标签总数', value: 0, desc: '所有标签数量' }
])

/*初始化图表*/
const initCharts = () => {
  if (articleTrendRef.value) {
    charts.articleTrend = echarts.init(articleTrendRef.value)
  }
  if (categoryPieRef.value) {
    charts.categoryPie = echarts.init(categoryPieRef.value)
  }
  if (timeDistributionRef.value) {
    charts.timeDistribution = echarts.init(timeDistributionRef.value)
  }
  if (wordsDistributionRef.value) {
    charts.wordsDistribution = echarts.init(wordsDistributionRef.value)
  }
  if (tagCloudRef.value) {
    charts.tagCloud = echarts.init(tagCloudRef.value)
  }
  if (tagTrendRef.value) {
    charts.tagTrend = echarts.init(tagTrendRef.value)
  }
}

/*加载数据*/
const loadData = async () => {
  try {
    /*加载概览数据*/
    const overview = await getArticleOverview()
    overviewData.value[0].value = overview.data.total
    overviewData.value[1].value = overview.data.published
    overviewData.value[2].value = overview.data.draft
    overviewData.value[3].value = overview.data.tags

    /*文章发布趋势*/
    const trend = await getArticleTrend()
    const trendOption: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: trend.data.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: trend.data.series,
        type: 'line',
        smooth: true
      }]
    }
    charts.articleTrend?.setOption(trendOption)

    /*文章分类分布*/
    const category = await getArticleCategory()
    const categoryOption: EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: '70%',
        data: category.data
      }]
    }
    charts.categoryPie?.setOption(categoryOption)

    /*发布时间分布*/
    const timeDistribution = await getArticleTimeDistribution()
    const timeOption: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: timeDistribution.data.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: timeDistribution.data.series,
        type: 'bar'
      }]
    }
    charts.timeDistribution?.setOption(timeOption)

    /*文章字数分布*/
    const words = await getArticleWords()
    const wordsOption: EChartsOption = {
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: words.data
      }]
    }
    charts.wordsDistribution?.setOption(wordsOption)

    /*标签统计*/
    const tagStats = await getTagStats()
    const tagCloudOption = {
      tooltip: {
        show: true
      },
      series: [{
        type: 'wordCloud',
        // 形状可以选择 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'star'
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [12, 36], // 文字大小范围
        rotationRange: [-90, 90], // 文字旋转角度范围
        rotationStep: 45, // 文字旋转角度步进
        gridSize: 8, // 网格大小
        drawOutOfBound: false,
        layoutAnimation: true, // 布局动画
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            // 随机颜色
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')'
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: tagStats.data.map((item: any) => ({
          name: item.name,
          value: item.value,
        }))
      }]
    }
    charts.tagCloud?.setOption(tagCloudOption)

    /*标签趋势*/
    const tagTrend = await getTagTrend()
    const tagTrendOption: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: tagTrend.data.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: tagTrend.data.series,
        type: 'line',
        smooth: true
      }]
    }
    charts.tagTrend?.setOption(tagTrendOption)
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

/*监听窗口大小变化*/
const handleResize = () => {
  Object.values(charts).forEach(chart => {
    chart?.resize()
  })
}

onMounted(() => {
  initCharts()
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(charts).forEach(chart => {
    chart?.dispose()
  })
})
</script>

<template>
  <div class="p-[16px]">
    <!-- 数据概览卡片 -->
    <n-grid :cols="4" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="item in overviewData" :key="item.label">
        <n-card :title="item.label" size="small">
          <div class="font-size-[24px] font-bold color-#2d8cf0">{{ item.value }}</div>
          <div class="font-size-[14px] color-#999 mt-[4px]">{{ item.desc }}</div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 图表区域 -->
    <n-grid :cols="2" :x-gap="12" :y-gap="12" class="mt-[4px]">
      <n-grid-item>
        <n-card title="文章发布趋势" size="small">
          <div ref="articleTrendRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="文章分类分布" size="small">
          <div ref="categoryPieRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="发布时间分布" size="small">
          <div ref="timeDistributionRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="文章字数分布" size="small">
          <div ref="wordsDistributionRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="热门标签" size="small">
          <div ref="tagCloudRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="标签使用趋势" size="small">
          <div ref="tagTrendRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped lang="scss">
</style>