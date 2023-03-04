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
  name: 'BarChart',
  components: {
    VueHighcharts
  },
  props: {
    tax: {
      type: Array,
      default: () => []
    },
    price: {
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
        type: 'column',
        height: props.chartHeight,
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: '経過時間（年）'
        },
        categories: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
          11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ],
      },
      yAxis: {
        min: 0,
        title: {
          text: '配当金額（万円）',
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: (HighCharts.theme && HighCharts.theme.textColor) || 'gray',
          },
        },
      },
      legend: {
        backgroundColor: (HighCharts.theme && HighCharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br />Total: {point.stackTotal}'
      },
      plotOptions: {
        series: {
          animation: {
            duration: 1500,
          }
        },
        column: {
          stacking: 'nomal',
          dataLabels: {
            enable: true
          }
        }
      },
      series: [{
        name: '税金分',
        data: props.tax,
        color: HighCharts.getOptions().colors[6],
      }, {
        name: '受取額（税引き後）',
        data: props.price,
        color: HighCharts.getOptions().colors[7],
      }]
    }
    return {
      chartOptions,
    }
  }
}
</script>

<style scoped>
</style>
