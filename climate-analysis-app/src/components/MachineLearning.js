import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const MachineLearning = () => {
  const rfChartRef = useRef(null);
  const cnnChartRef = useRef(null);
  const featureImportanceRef = useRef(null);
  const comparisonRef = useRef(null);

  useEffect(() => {
    const norwayHistoricalYears = [1800, 1850, 1900, 1950, 2000, 2020];
    const norwayHistoricalCo2 = [0.1, 0.2, 0.5, 2.0, 8.5, 8.2];
    
    const futureYears = [2025, 2030, 2035, 2040, 2045];
    
    const rfPredictions = [8.86, 8.86, 8.86, 8.86, 8.86];
    const cnnPredictions = [11.24, 11.73, 12.23, 12.72, 13.22];
    
    const featureImportance = [
      { feature: 'Year', importance: 0.567 },
      { feature: 'Energy Use', importance: 0.413 },
      { feature: 'GDP Growth', importance: 0.020 }
    ];

    const rfTrace = {
      x: [...norwayHistoricalYears, ...futureYears],
      y: [...norwayHistoricalCo2, ...rfPredictions],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Random Forest Model',
      line: { color: '#4ecdc4', width: 3 },
      marker: { size: 8, color: '#4ecdc4' }
    };

    const historicalTrace = {
      x: norwayHistoricalYears,
      y: norwayHistoricalCo2,
      type: 'scatter',
      mode: 'markers',
      name: 'Historical Data',
      marker: { size: 12, color: '#ff6b6b', symbol: 'circle' }
    };

    const cnnTrace = {
      x: [...norwayHistoricalYears, ...futureYears],
      y: [...norwayHistoricalCo2, ...cnnPredictions],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'CNN Model',
      line: { color: '#45b7d1', width: 3 },
      marker: { size: 8, color: '#45b7d1' }
    };

    const rfLayout = {
      title: 'Random Forest: CO2 Emission Predictions',
      xaxis: { 
        title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
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

    const cnnLayout = {
      title: 'CNN: CO2 Emission Predictions',
      xaxis: { 
        title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
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

    const featureLayout = {
      title: 'Random Forest Feature Importance',
      xaxis: { 
        title: { text: 'Features', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      yaxis: { 
        title: { text: 'Importance Score', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#ffffff' },
      margin: { t: 50, b: 80, l: 80, r: 50 }
    };

    const featureTrace = {
      x: featureImportance.map(f => f.feature),
      y: featureImportance.map(f => f.importance),
      type: 'bar',
      marker: { color: '#4ecdc4' }
    };

    const comparisonLayout = {
      title: 'Model Comparison & Future Predictions',
      xaxis: { 
        title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
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

    const comparisonTrace = {
      x: futureYears,
      y: rfPredictions,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Random Forest Predictions',
      line: { color: '#4ecdc4', width: 3, dash: 'dash' },
      marker: { size: 10, color: '#4ecdc4', symbol: 'diamond' }
    };

    const cnnComparisonTrace = {
      x: futureYears,
      y: cnnPredictions,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'CNN Predictions',
      line: { color: '#45b7d1', width: 3, dash: 'dot' },
      marker: { size: 10, color: '#45b7d1', symbol: 'square' }
    };

    Plotly.newPlot(rfChartRef.current, [rfTrace, historicalTrace], rfLayout, { responsive: true });
    Plotly.newPlot(cnnChartRef.current, [cnnTrace, historicalTrace], cnnLayout, { responsive: true });
    Plotly.newPlot(featureImportanceRef.current, [featureTrace], featureLayout, { responsive: true });
    Plotly.newPlot(comparisonRef.current, [comparisonTrace, cnnComparisonTrace], comparisonLayout, { responsive: true });
  }, []);

  return (
    <section className="section" id="ml">
      <h2>Machine Learning Analysis</h2>
      <div className="content-grid">
        <div className="card">
          <h3>Random Forest Model</h3>
          <div className="chart-container" ref={rfChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">0.987</div>
              <div className="metric-label">Training R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.953</div>
              <div className="metric-label">Test R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.363</div>
              <div className="metric-label">Test MAE</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Analysis:</strong> The Random Forest model achieved excellent performance with 98.7% training accuracy and 95.3% test accuracy. It shows consistent future predictions around 8.86 metric tons per capita, indicating stable emission patterns.</p>
          </div>
        </div>

        <div className="card">
          <h3>CNN Model</h3>
          <div className="chart-container" ref={cnnChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">0.957</div>
              <div className="metric-label">Training R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.954</div>
              <div className="metric-label">Test R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.504</div>
              <div className="metric-label">Test MAE</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Analysis:</strong> The CNN model shows strong performance with 95.7% training accuracy. It predicts a gradual increase in emissions from 11.24 to 13.22 metric tons per capita by 2045, suggesting a different trend than the Random Forest.</p>
          </div>
        </div>

        <div className="card">
          <h3>Feature Importance</h3>
          <div className="chart-container" ref={featureImportanceRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">56.7%</div>
              <div className="metric-label">Year Importance</div>
            </div>
            <div className="metric">
              <div className="metric-value">41.3%</div>
              <div className="metric-label">Energy Use</div>
            </div>
            <div className="metric">
              <div className="metric-value">2.0%</div>
              <div className="metric-label">GDP Growth</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Analysis:</strong> Time (Year) is the most important feature at 56.7%, followed by Energy Use at 41.3%. GDP Growth has minimal impact at only 2.0%, suggesting temporal trends and energy consumption are the key drivers of CO2 emissions.</p>
          </div>
        </div>

        <div className="card">
          <h3>Model Comparison</h3>
          <div className="chart-container" ref={comparisonRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">RF: 8.86</div>
              <div className="metric-label">2035 Prediction</div>
            </div>
            <div className="metric">
              <div className="metric-value">CNN: 12.23</div>
              <div className="metric-label">2035 Prediction</div>
            </div>
            <div className="metric">
              <div className="metric-value">+38%</div>
              <div className="metric-label">Difference</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Analysis:</strong> The models show divergent future predictions. Random Forest predicts stable emissions at 8.86 tons, while CNN forecasts increasing emissions to 12.23 tons by 2035. This 38% difference highlights model uncertainty.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineLearning;
