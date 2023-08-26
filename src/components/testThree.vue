<template>
    <Bar :data="processedChartData" :options="chartOptions"/>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: { Bar },
    props: {
        chartData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chartOptions: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            //use whole numbers only, but it will still automatically adjust scales 
                            beginAtZero: true,
                            callback: function(value) {
                                if (value % 1 === 0) { // if whole number
                                    return value;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    computed: {
        processedChartData() {
            return {
                labels: this.chartData.labels,
                datasets: [
                    {
                        backgroundColor: '#f87979',
                        data: this.chartData.datasets[0].data
                    }
                ]
            }
        }
    },

}
  </script>