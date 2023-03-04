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

export default {
  name: 'PieChart',
  components: {
    VueHighcharts
  },
  props: {
    data: {
      type: Object,
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
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        height: props.chartHeight,
      },
      title: null,
      credits: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: '万円',
        borderColor: '#8ae',
        shape: 'rect',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        followPointer: false,
        stickOnContact: true,
      },
      plotOptions: {
        series: {
          animation: {
            duration: 1500,
          },
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br />{point.percentage:.0f} %',
            style: {
              fontSize: '12px',
            },
            distance: -30,
          },
          point: {
            events: {
              mouseOver: function () {
                this.graphic.toFront();
              }
            }
          },
          cursor: 'pointer',
          borderWidth: 3
        },
        pie: {
          innerSize: '40%',
          // startAngle: -90,
          // endAngle: 90,
          // center: [160, 150],
          // size: '300',
        },
      },
      series: [{
        name: '最終資産額',
        data: props.data
      }]
    }
    return {
      chartOptions
    }
  },
};
</script>

<style scoped>
</style>
