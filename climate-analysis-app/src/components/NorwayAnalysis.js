import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist';
import { loadClimateData, processNorwayData, processNorwayEnergyData, processNorwayGdpData } from '../utils/dataLoader';

const NorwayAnalysis = () => {
  const co2ChartRef = useRef(null);
  const energyChartRef = useRef(null);
  const gdpChartRef = useRef(null);
  const [data, setData] = useState(null);
  const [energyData, setEnergyData] = useState(null);
  const [gdpData, setGdpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const rawData = await loadClimateData();
      if (rawData) {
        const norwayData = processNorwayData(rawData);
        const norwayEnergy = processNorwayEnergyData(rawData);
        const norwayGdp = processNorwayGdpData(rawData);
        
        setData(norwayData);
        setEnergyData(norwayEnergy);
        setGdpData(norwayGdp);
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const years = data.map(d => d.year);
    const co2Data = data.map(d => d.co2);

    const co2Trace = {
      x: years,
      y: co2Data,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'CO2 per Capita',
      line: { color: '#ff6b6b', width: 3 },
      marker: { size: 8, color: '#ff6b6b' }
    };

    const co2Layout = {
      title: 'Norway CO2 Emissions per Capita Over Time',
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

    Plotly.newPlot(co2ChartRef.current, [co2Trace], co2Layout, { responsive: true });

    if (energyData && energyData.length > 0) {
      const energyYears = energyData.map(d => d.year);
      const energyValues = energyData.map(d => d.energy);
      
      const energyTrace = {
        x: energyYears,
        y: energyValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Energy Use per Capita',
        line: { color: '#4ecdc4', width: 3 },
        marker: { size: 8, color: '#4ecdc4' }
      };

      const energyLayout = {
        title: 'Norway Energy Use per Capita Over Time',
        xaxis: { 
          title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        yaxis: { 
          title: { text: 'Energy Use (kg oil eq.)', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        margin: { t: 50, b: 80, l: 80, r: 50 }
      };

      Plotly.newPlot(energyChartRef.current, [energyTrace], energyLayout, { responsive: true });
    }

    if (gdpData && gdpData.length > 0) {
      const gdpYears = gdpData.map(d => d.year);
      const gdpValues = gdpData.map(d => d.gdp);
      
      const gdpTrace = {
        x: gdpYears,
        y: gdpValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'GDP Growth',
        line: { color: '#45b7d1', width: 3 },
        marker: { size: 8, color: '#45b7d1' }
      };

      const gdpLayout = {
        title: 'Norway GDP per Capita Growth Over Time',
        xaxis: { 
          title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        yaxis: { 
          title: { text: 'GDP Growth (%)', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        margin: { t: 50, b: 80, l: 80, r: 50 }
      };

      Plotly.newPlot(gdpChartRef.current, [gdpTrace], gdpLayout, { responsive: true });
    }
  }, [data, energyData, gdpData]);

  if (loading) {
    return (
      <section className="section" id="norway">
        <h2>Norway Analysis</h2>
        <div className="loading">Loading Norway data...</div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="section" id="norway">
        <h2>Norway Analysis</h2>
        <div className="error">Error: Norway data not available</div>
      </section>
    );
  }

  const avgCo2 = data.reduce((sum, d) => sum + d.co2, 0) / data.length;
  const minCo2 = Math.min(...data.map(d => d.co2));
  const maxCo2 = Math.max(...data.map(d => d.co2));
  const yearRange = `${data[0].year} - ${data[data.length - 1].year}`;

  return (
    <section className="section" id="norway">
      <h2>Norway Analysis</h2>
      
      <div className="content-grid">
        <div className="card">
          <h3>CO2 Emissions</h3>
          <div className="chart-container" ref={co2ChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{avgCo2.toFixed(2)}</div>
              <div className="metric-label">Avg CO2 per Capita (tons)</div>
            </div>
            <div className="metric">
              <div className="metric-value">{minCo2.toFixed(2)} - {maxCo2.toFixed(2)}</div>
              <div className="metric-label">Range (tons)</div>
            </div>
            <div className="metric">
              <div className="metric-value">{yearRange}</div>
              <div className="metric-label">Data Period</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Energy Use</h3>
          <div className="chart-container" ref={energyChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{energyData ? energyData.reduce((sum, d) => sum + d.energy, 0) / energyData.length : 'N/A'}</div>
              <div className="metric-label">Avg Energy Use (kg oil eq.)</div>
            </div>
            <div className="metric">
              <div className="metric-value">{energyData ? energyData.length : 0}</div>
              <div className="metric-label">Data Points</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>GDP Growth</h3>
          <div className="chart-container" ref={gdpChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{gdpData ? gdpData.reduce((sum, d) => sum + d.gdp, 0) / gdpData.length : 'N/A'}</div>
              <div className="metric-label">Avg GDP Growth (%)</div>
            </div>
            <div className="metric">
              <div className="metric-value">{gdpData ? gdpData.length : 0}</div>
              <div className="metric-label">Data Points</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NorwayAnalysis;
