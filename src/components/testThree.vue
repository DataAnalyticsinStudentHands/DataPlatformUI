<template>
    <Bar :data="processedChartData" :options="chartOptions"/>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'

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
                            // use whole numbers only, but it will still automatically adjust scales 
                            beginAtZero: true,
                            callback: function(value) {
                                if (value % 1 === 0) { // if whole number
                                    return value;
                                }
                            }
                        }
                    }
                }
            },
            maxLabelLength: 30, // Define the maximum label length
            shadesOfRed: this.generateShadesOfRed(10)
        }
    },
    computed: {
        processedChartData() {
            const dataLength = this.chartData.datasets[0].data.length;
            const backgroundColors = new Array(dataLength)
                .fill(null)
                .map((_, index) => this.shadesOfRed[index % 10]);

            // Truncate labels that exceed the maximum length
            const truncatedLabels = this.chartData.labels.map(label =>
                label.length > this.maxLabelLength ? `${label.substring(0, this.maxLabelLength)}...` : label
            );

            return {
                labels: truncatedLabels, // Use truncated labels
                datasets: [
                    {
                        backgroundColor: backgroundColors,
                        data: this.chartData.datasets[0].data
                    }
                ]
            }
        }
    },
    methods: {
        generateShadesOfRed(count) {
            const shades = [];
            for (let i = 0; i < count; i++) {
                const redComponent = 248;
                const greenComponent = Math.floor(110 + Math.random() * 20);  // Ensuring shades around 110 to 130
                const blueComponent = Math.floor(110 + Math.random() * 20);  // Ensuring shades around 110 to 130
                shades.push(`rgb(${redComponent}, ${greenComponent}, ${blueComponent})`);
            }
            return shades;
        }
    }
}
</script>
