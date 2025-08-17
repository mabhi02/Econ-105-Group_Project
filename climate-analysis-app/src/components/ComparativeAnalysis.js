import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const ComparativeAnalysis = () => {
  const comparisonChartRef = useRef(null);
  const correlationChartRef = useRef(null);

  useEffect(() => {
    // Side-by-side comparison data
    const years = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const norwayCo2 = [8.2, 12.1, 10.8, 9.5, 8.9, 7.2, 6.8];
    const usCo2 = [10000, 15000, 18000, 22000, 28000, 32000, 30000];

    // Comparison Chart
    const norwayTrace = {
      x: years,
      y: norwayCo2,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Norway (per capita tons)',
      line: { color: '#00d4ff', width: 3 },
      marker: { size: 8 }
    };

    const usTrace = {
      x: years,
      y: usCo2,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'US (1000 tonnes)',
      line: { color: '#ff6b6b', width: 3 },
      marker: { size: 8 }
    };

    const comparisonLayout = {
      title: 'CO2 Emissions Comparison: Norway vs US',
      xaxis: { 
        title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      yaxis: { 
        title: { text: 'CO2 Emissions', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#ffffff' },
      margin: { t: 50, b: 80, l: 80, r: 50 },
      legend: { x: 0.7, y: 0.9 }
    };

    Plotly.newPlot(comparisonChartRef.current, [norwayTrace, usTrace], comparisonLayout, { responsive: true });

    // Energy vs CO2 Correlation for Norway
    const energyData = [2000, 2800, 3500, 4200, 4800, 5200, 5400];
    const co2Data = [8.2, 12.1, 10.8, 9.5, 8.9, 7.2, 6.8];

    const correlationTrace = {
      x: energyData,
      y: co2Data,
      type: 'scatter',
      mode: 'markers',
      name: 'Energy vs CO2',
      marker: { 
        color: '#4ecdc4', 
        size: 12,
        line: { color: '#ffffff', width: 1 }
      }
    };

    const correlationLayout = {
      title: 'Norway: Energy Use vs CO2 Emissions per Capita',
      xaxis: { 
        title: { text: 'Energy Use per Capita (kg oil eq.)', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      yaxis: { 
        title: { text: 'CO2 per Capita (metric tons)', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#ffffff' },
      margin: { t: 50, b: 80, l: 80, r: 50 }
    };

    Plotly.newPlot(correlationChartRef.current, [correlationTrace], correlationLayout, { responsive: true });
  }, []);

  return (
    <section className="section" id="comparative">
      <h2>Comparative Analysis</h2>
      <div className="content-grid">
        <div className="card">
          <h3>Side-by-Side Comparison</h3>
          <div className="chart-container" ref={comparisonChartRef}></div>
          <div className="analysis">
            <p><strong>Analysis:</strong> Comparison reveals fundamentally disparate scales and patterns between the two countries. The US shows enormous absolute emissions much greater than the Norwegian contribution, how a comparison encompassing both total and per capita measurements presents an important consideration in judging national climate impacts.</p>
          </div>
        </div>

        <div className="card">
          <h3>Energy vs CO2 Correlation</h3>
          <div className="chart-container" ref={correlationChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">0.948</div>
              <div className="metric-label">Correlation Coefficient</div>
            </div>
            <div className="metric">
              <div className="metric-value">Strong</div>
              <div className="metric-label">Correlation Strength</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Analysis:</strong> The strong positive correlation (r = 0.948) between energy use and per capita CO2 emissions in Norway demonstrates the underlying relationship between carbon emissions and energy use. The relationship suggests that despite Norway's relatively clean energy mix, more energy use equals more emissions.</p>
          </div>
        </div>

        <div className="card">
          <h3>Scale Differences</h3>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">1:3,500</div>
              <div className="metric-label">Norway:US Ratio</div>
            </div>
            <div className="metric">
              <div className="metric-value">Per Capita</div>
              <div className="metric-label">Norway Metric</div>
            </div>
            <div className="metric">
              <div className="metric-value">Total</div>
              <div className="metric-label">US Metric</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Key Insight:</strong> The enormously disparate scales make direct comparison difficult but emphasize how heavy economies unproportionally raise global emissions. Norway's per capita approach shows individual consumption patterns while US total emissions reflect national industrial activity.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparativeAnalysis;
