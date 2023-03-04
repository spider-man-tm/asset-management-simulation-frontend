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
  name: 'DemolitionChart',
  components: {
    VueHighcharts,
  },
  props: {
    duration: {
      type: Number,
      default: 20
    },
    priceTransition: {
      type: Array,
      default: () => []
    },
    chartHeight: {
      type: Number,
      default: () => 450,
    },
  },
  setup (props) {
    let seq = []
    const today = new Date()
    const timeSeq = []
    for (let i = 0; i < props.duration + 1; i++) {
      if (i !== 0) today.setFullYear(today.getFullYear() + 1)
      timeSeq.push(today.getTime())
    }
    for (let i = 0; i < props.duration + 1; i++) {
      seq.push([timeSeq[i], props.priceTransition[i]])
    }
    const chartOptions = {
      chart: {
        type: 'area',
        height: props.chartHeight,
      },
      title: null,
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          year: '%Y年',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '資産総額（万円）',
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
        enabled: true,
        align: 'right',
      },
      credits: {
        enabled: false,
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
        },
        area: {
            stacking: 'normal',
        }
      },
      series: [
        {
          name: '資産総額',
          color: HighCharts.getOptions().colors[2],
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, HighCharts.getOptions().colors[2]],
              [1, HighCharts.Color(HighCharts.getOptions().colors[2]).setOpacity(0).get('rgba')],
            ],
          },
          data: seq
        }
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
