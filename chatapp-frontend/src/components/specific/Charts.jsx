import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { palette } from "../../constants/color";
import { getLast7Days } from "../../lib/features";
import { motion } from "framer-motion";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  animation: {
    duration: 2000,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: palette.navy,
      titleColor: palette.cream,
      bodyColor: palette.cream,
      borderColor: palette.blue,
      borderWidth: 1,
      padding: 10,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: palette.blue,
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        color: palette.blue,
      }
    },
  },
};

const LineChart = ({ value = [] }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimated(true);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: `${palette.blue}33`, // Adding transparency
        borderColor: palette.blue,
        borderWidth: 2,
        pointBackgroundColor: palette.orange,
        pointBorderColor: palette.navy,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4, // Adds curve to the line
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: animated ? 1 : 0, y: animated ? 0 : 20 }}
      transition={{ duration: 0.7 }}
    >
      <Line data={data} options={lineChartOptions} />
    </motion.div>
  );
};

const doughnutChartOptions = {
  responsive: true,
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1500,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: palette.navy,
      titleColor: palette.cream,
      bodyColor: palette.cream,
      borderColor: palette.blue,
      borderWidth: 1,
      padding: 10,
    },
  },
  cutout: 120,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimated(true);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [palette.blue, palette.orange],
        hoverBackgroundColor: [palette.blue, palette.maroon],
        borderColor: [palette.navy, palette.navy],
        borderWidth: 2,
        offset: 40,
      },
    ],
  };

  return (
    <motion.div
      style={{ zIndex: 10 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: animated ? 1 : 0, scale: animated ? 1 : 0.8 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Doughnut data={data} options={doughnutChartOptions} />
    </motion.div>
  );
};

export { DoughnutChart, LineChart };