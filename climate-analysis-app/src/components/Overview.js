import React from 'react';

const Overview = () => {
  return (
    <section className="section" id="overview">
      <h2>Project Overview</h2>
      
      <div className="overview-content">
        <div className="overview-section">
          <h3>Research Questions</h3>
          <ul>
            <li>How do CO2 emissions compare between Norway and US over time?</li>
            <li>What are the energy consumption patterns in both countries?</li>
            <li>How do economic indicators correlate with environmental metrics?</li>
            <li>What statistical relationships exist between emissions and other variables?</li>
          </ul>
        </div>

        <div className="overview-section">
          <h3>Data Sources</h3>
          <div className="data-sources">
            <div className="source-group">
              <h4>Norway Data</h4>
              <ul>
                <li>CO2 emissions, energy use, and GDP per capita data from global datasets</li>
                <li>Disaster data from EM-DAT</li>
                <li>Temperature data from the World Bank</li>
              </ul>
            </div>
            <div className="source-group">
              <h4>US Data</h4>
              <ul>
                <li>CO2 emissions, energy use, and GDP per capita data from global datasets</li>
                <li>Disaster data from NOAA</li>
                <li>Temperature data from NOAA</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="overview-section">
          <h3>Methodology</h3>
          <p>This analysis employs a comparative approach using time series data analysis, statistical correlation methods, and machine learning techniques. We examine historical trends, perform statistical tests for significance, and use predictive modeling to understand future emission patterns.</p>
        </div>

        <div className="overview-section">
          <h3>Key Insights</h3>
          <ul>
            <li>Norway shows decreasing CO2 emissions trend with strong policy influence</li>
            <li>US demonstrates increasing emissions trend with larger absolute scale</li>
            <li>Energy consumption strongly correlates with CO2 emissions in both countries</li>
            <li>Economic growth shows moderate correlation with environmental metrics</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Overview;
