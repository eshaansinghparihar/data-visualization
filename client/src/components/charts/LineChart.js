import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement, zoomPlugin);

const LineChart = ({ data, feature }) => {
    const aggregatedData = data.reduce((acc, entry) => {
        const day = entry.Day;
        const value = parseInt(entry[feature], 0);

        if (!acc[day]) {
            acc[day] = 0;
        }
        acc[day] += value;

        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    
    const labels = Object.keys(aggregatedData);
    const formattedLabels = labels.map(formatDate);
    const shiftedLabels = ['']; 
    const shiftedData = [null]; 
    shiftedLabels.push(...formattedLabels);
    shiftedData.push(...labels.map(day => aggregatedData[day] || 0));

    const lineData = {
        labels: shiftedLabels,
        datasets: [
            {
                label: feature,
                data: shiftedData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'lightblue',
                spanGaps: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    enabled: true,
                    mode: 'x',
                    wheel: {
                        enabled: true,
                      },
                    pinch: {
                        enabled: true
                      },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days',
                },
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Values',
                },
            },
        },
    };

    // const options = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             display: false,
    //         },
    //         zoom: {
    //             pan: {
    //                 enabled: true,
    //                 mode: 'x',
    //             },
    //             zoom: {
    //                 enabled: true,
    //                 mode: 'x',
    //             },
    //         },
    //     },
    //     scales: {
    //         x: {
    //             title: {
    //                 display: true,
    //                 text: 'Days',
    //             },
    //             ticks: {
    //                 autoSkip: false,
    //             },
    //         },
    //         y: {
    //             title: {
    //                 display: true,
    //                 text: 'Values',
    //             },
    //         },
    //     },
    // };

    return <Line data={lineData} options={options} />;
};

export default LineChart;
