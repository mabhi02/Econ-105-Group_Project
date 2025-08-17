import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist';
import { loadClimateData, processUSData, processUSCo2Data, processUSEnergyData } from '../utils/dataLoader';

const USAnalysis = () => {
  const tempChartRef = useRef(null);
  const co2ChartRef = useRef(null);
  const energyChartRef = useRef(null);
  const [tempData, setTempData] = useState(null);
  const [co2Data, setCo2Data] = useState(null);
  const [energyData, setEnergyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const rawData = await loadClimateData();
      if (rawData) {
        const usTemp = processUSData(rawData);
        const usCo2 = processUSCo2Data(rawData);
        const usEnergy = processUSEnergyData(rawData);
        
        setTempData(usTemp);
        setCo2Data(usCo2);
        setEnergyData(usEnergy);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!tempData || tempData.length === 0) return;

    const years = tempData.map(d => d.year);
    const tempValues = tempData.map(d => d.temperature);

    const tempTrace = {
      x: years,
      y: tempValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Temperature',
      line: { color: '#ff6b6b', width: 3 },
      marker: { size: 8, color: '#ff6b6b' }
    };

    const tempLayout = {
      title: 'US Average Temperature Over Time',
      xaxis: { 
        title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      yaxis: { 
        title: { text: 'Temperature (°F)', font: { color: '#ffffff', size: 14 } },
        gridcolor: 'rgba(255,255,255,0.1)',
        tickfont: { color: '#ffffff' }
      },
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#ffffff' },
      margin: { t: 50, b: 80, l: 80, r: 50 }
    };

    Plotly.newPlot(tempChartRef.current, [tempTrace], tempLayout, { responsive: true });

    if (co2Data && co2Data.length > 0) {
      const co2Years = co2Data.map(d => d.year);
      const co2Values = co2Data.map(d => d.co2);
      
      const co2Trace = {
        x: co2Years,
        y: co2Values,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'CO2 Emissions',
        line: { color: '#4ecdc4', width: 3 },
        marker: { size: 8, color: '#4ecdc4' }
      };

      const co2Layout = {
        title: 'US CO2 Emissions Over Time',
        xaxis: { 
          title: { text: 'Year', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        yaxis: { 
          title: { text: 'CO2 Emissions (1000 tonnes)', font: { color: '#ffffff', size: 14 } },
          gridcolor: 'rgba(255,255,255,0.1)',
          tickfont: { color: '#ffffff' }
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        margin: { t: 50, b: 80, l: 80, r: 50 }
      };

      Plotly.newPlot(co2ChartRef.current, [co2Trace], co2Layout, { responsive: true });
    }

    if (energyData && energyData.length > 0) {
      const energyYears = energyData.map(d => d.year);
      const energyValues = energyData.map(d => d.energy);
      
      const energyTrace = {
        x: energyYears,
        y: energyValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Energy Use',
        line: { color: '#45b7d1', width: 3 },
        marker: { size: 8, color: '#45b7d1' }
      };

      const energyLayout = {
        title: 'US Energy Use per Capita Over Time',
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
  }, [tempData, co2Data, energyData]);

  if (loading) {
    return (
      <section className="section" id="us">
        <h2>US Analysis</h2>
        <div className="loading">Loading US data...</div>
      </section>
    );
  }

  if (!tempData || tempData.length === 0) {
    return (
      <section className="section" id="us">
        <h2>US Analysis</h2>
        <div className="error">Error: US temperature data not available</div>
      </section>
    );
  }

  const avgTemp = tempData.reduce((sum, d) => sum + d.temperature, 0) / tempData.length;
  const minTemp = Math.min(...tempData.map(d => d.temperature));
  const maxTemp = Math.max(...tempData.map(d => d.temperature));
  const yearRange = `${tempData[0].year} - ${tempData[tempData.length - 1].year}`;

  const avgCo2 = co2Data ? co2Data.reduce((sum, d) => sum + d.co2, 0) / co2Data.length : 0;
  const avgEnergy = energyData ? energyData.reduce((sum, d) => sum + d.energy, 0) / energyData.length : 0;

  return (
    <section className="section" id="us">
      <h2>US Analysis</h2>
      
      <div className="content-grid">
        <div className="card">
          <h3>Temperature</h3>
          <div className="chart-container" ref={tempChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{avgTemp.toFixed(1)}°F</div>
              <div className="metric-label">Avg Temperature</div>
            </div>
            <div className="metric">
              <div className="metric-value">{minTemp.toFixed(1)}°F - {maxTemp.toFixed(1)}°F</div>
              <div className="metric-label">Range</div>
            </div>
            <div className="metric">
              <div className="metric-value">{yearRange}</div>
              <div className="metric-label">Data Period</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>CO2 Emissions</h3>
          <div className="chart-container" ref={co2ChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{avgCo2.toFixed(0)}</div>
              <div className="metric-label">Avg CO2 Emissions (1000 tonnes)</div>
            </div>
            <div className="metric">
              <div className="metric-value">+200%</div>
              <div className="metric-label">Growth 1960-2000</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Energy Use</h3>
          <div className="chart-container" ref={energyChartRef}></div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{avgEnergy.toFixed(0)}</div>
              <div className="metric-label">Avg Energy Use (kg oil eq.)</div>
            </div>
            <div className="metric">
              <div className="metric-value">+36%</div>
              <div className="metric-label">Growth 1960-2020</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USAnalysis;
