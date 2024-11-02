import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PollChart = ({yesCount, noCount}) => {
    const data = {
        labels: ['Yes', 'No'],
        datasets: [
          {
            label: 'Poll Results',
            data: [yesCount, noCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
      };
    
      return (
        <div style={{ width: '50%', height: '50%' }}>
          <Bar data={data} options={options} />
        </div>
      );
}

export default PollChart;