<template>
  <vue-highcharts
    type="stockChart"
    :options="chartOptions"
    :redrawOnUpdate="true"
    :oneToOneUpdate="false"
    :animateOnUpdate="true"
    @updated="onUpdated"/>
</template>

<script>
import VueHighcharts from 'vue3-highcharts'
import HighCharts from 'highcharts'
import StockCharts from 'highcharts/modules/stock'

StockCharts(HighCharts);

export default {
  name: 'TransitionChart',
  components: {
    VueHighcharts,
  },
  props: {
    max_year: {
      type: Number,
      default: () => 450
    },
    capitalPriceTransition: {
      type: Array,
      default: () => []
    },
    priceTransition: {
      type: Array,
      default: () => []
    },
    chartHeight: {
      type: Number,
      default: () => 20,
    },
  },
  setup (props) {
    let seq1 = []
    let seq2 = []
    const today = new Date()
    const timeSeq = []
    for (let i = 0; i < props.max_year + 1; i++) {
      if (i !== 0) today.setFullYear(today.getFullYear() + 1)
      timeSeq.push(today.getTime())
    }
    for (let i = 0; i < props.max_year + 1; i++) {
      seq1.push([timeSeq[i], props.capitalPriceTransition[i]])
      seq2.push([timeSeq[i], props.priceTransition[i]])
    }
    const chartOptions = {
      chart: {
        type: 'areaspline',
        height: props.chartHeight,
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          year: '%Y年',
        },
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
      credits: {
        enabled: false,
      },
      rangeSelector: {
        buttons: [
          {
            type: 'year',
            count: 5,
            text: '5年'
          }, {
            type: 'year',
            count: 10,
            text: '10年'
          }, {
            type: 'all',
            text: '全期間'
          }
        ],
        selected: 2,
        inputEnabled: false,
      },
      plotOptions: {
        series: {
          animation: {
            duration: 1500,
          }
        }
      },
      series: [
        {
          name: '資産総額',
          color: HighCharts.getOptions().colors[5],
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, HighCharts.getOptions().colors[5]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[5]).setOpacity(0).get('rgba')],
            ],
          },
          data: seq2,
        }, {
          name: '元本',
          color: HighCharts.getOptions().colors[0],
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, HighCharts.getOptions().colors[0]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
            ],
          },
          data: seq1,
        },
      ]
    }
    return {
      chartOptions,
    }
  }
};
</script>

<style scoped>
</style>
