import { useColorMode } from '@chakra-ui/react';

const useChartOptions = () => {
  const { colorMode } = useColorMode();

  // Set colors based on the current color mode
  const axisColor = colorMode === 'dark' ? 'red' : 'black';
  const legendColor = colorMode === 'dark' ? 'gray.300' : 'gray.700';

  return {
    plugins: {
      legend: {
        labels: {
          color: legendColor, 
          font: {
            size: 14, // Legend font size
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: axisColor, // X-axis label text color
          font: {
            size: 12, // X-axis font size
          },
        },
      },
      y: {
        ticks: {
          color: axisColor, // Y-axis label text color
          font: {
            size: 12, // Y-axis font size
          },
        },
      },
    },
  };
};

export default useChartOptions;
