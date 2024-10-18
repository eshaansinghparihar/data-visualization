import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ data, features, setSelectedFeature }) => {
    const featureSums = features.reduce((acc, feature) => {
        acc[feature] = data.reduce((sum, entry) => sum + parseInt(entry[feature]), 0);
        return acc;
    }, {});

    const chartData = {
        labels: features,
        datasets: [
            {
                data: features.map(feature => featureSums[feature]),
                backgroundColor: 'blue',
                hoverBackgroundColor: 'red',
                borderWidth: 1,
            },
        ],
    };
    const options = {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Total Time Spent',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Features',
                },
                ticks: {
                    autoSkip: false,
                },
            },
        },
        onClick: (evt, activeElements) => {
            if (activeElements.length > 0) {
                const featureIndex = activeElements[0].index;
                if(setSelectedFeature)
                setSelectedFeature(features[featureIndex]);
            }
        },
    };

    return <Bar data={chartData} options={options} />;
};
export default BarGraph;