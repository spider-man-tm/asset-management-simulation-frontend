<template>
  <vue-highcharts
    type="chart"
    :options="chartOptions"
    :redrawOnUpdate="true"
    :oneToOneUpdate="false"
    :animateOnUpdate="true"
    @updated="onUpdated"/>
</template>

<script>
import VueHighcharts from 'vue3-highcharts'
import HighCharts from 'highcharts'

export default {
  name: 'DensityPlot',
  components: {
    VueHighcharts
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    chartHeight: {
      type: Number,
      default: () => 450,
    },
  },
  setup (props) {
    const chartOptions = {
      chart: {
        type: 'areaspline',
        height: props.chartHeight,
      },
      xAxis: {
        labels: {
          format: `{value} 万円`
        },
        title: null
      },
      yAxis: {
        labels: {
          enabled: false
        }
      },
      legend: {
        enabled: true,
        align: 'right',
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          animation: {
            duration: 1500,
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false
              }
            }
          }
        }
      },
      series: [
        {
          name: '評価損益期待値',
          color: HighCharts.getOptions().colors[1],
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, HighCharts.getOptions().colors[3]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[8]).setOpacity(0).get('rgba')],
            ],
          },
          data: props.data,
        }
      ]
    }
    return {
      chartOptions
    }
  }
}
</script>

<style scoped>
</style>
