<script lang="ts" setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide } from 'vue';

use([
    CanvasRenderer,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

provide(THEME_KEY, 'dark');

const option = ref({
    title: {
        text: 'Traffic Sources',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    },
    series: [
        {
            name: 'Traffic Sources',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 335, name: 'Direct' },
                { value: 310, name: 'Email' },
                { value: 234, name: 'Ad Networks' },
                { value: 135, name: 'Video Ads' },
                { value: 1548, name: 'Search Engines' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 1)',
                },
            },
        },
    ],
});
</script>

<template>
    <div class="traffic-monitoring-wrap">
        <div id="title">
            流量监控
        </div>
        <v-chart
            autoresize
            class="chart"
            :option="option"/>
    </div>
</template>

<style scoped>
.traffic-monitoring-wrap{
    margin: 24px;
    overflow-x: clip;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    min-height: 1200px;
    padding: 24px;
    border-radius: 8px;
    background-color: rgba(26,26,26,0.5);
    backdrop-filter: blur(12px);
}
#title{
    color: darkgrey;
    font-size: 24px;
    font-weight: bold;
    width: fit-content;
    cursor: pointer;
}
.chart{
    height: 560px;
    border-radius: 12px !important;
    background-color: transparent !important;
}

</style>