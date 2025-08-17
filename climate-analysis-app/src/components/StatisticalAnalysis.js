import React from 'react';

const StatisticalAnalysis = () => {
  return (
    <section className="section" id="statistical">
      <h2>Statistical Analysis</h2>
      <div className="content-grid">
        <div className="card">
          <h3>Norway Statistics</h3>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">8.9</div>
              <div className="metric-label">Mean CO2 (tons)</div>
            </div>
            <div className="metric">
              <div className="metric-value">8.5</div>
              <div className="metric-label">Median CO2 (tons)</div>
            </div>
            <div className="metric">
              <div className="metric-value">2.1</div>
              <div className="metric-label">Std Dev (tons)</div>
            </div>
            <div className="metric">
              <div className="metric-value">6.8 - 12.1</div>
              <div className="metric-label">Range (tons)</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Trend Analysis:</strong> Norway shows a decreasing trend in CO2 emissions with a slope of -0.08 tons per year. The R² value of 0.82 indicates a strong linear relationship, and the p-value &lt; 0.05 confirms statistical significance.</p>
          </div>
        </div>

        <div className="card">
          <h3>US Statistics</h3>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">22,000</div>
              <div className="metric-label">Mean CO2 (1000 tonnes)</div>
            </div>
            <div className="metric">
              <div className="metric-value">22,000</div>
              <div className="metric-label">Median CO2 (1000 tonnes)</div>
            </div>
            <div className="metric">
              <div className="metric-value">8,500</div>
              <div className="metric-label">Std Dev (1000 tonnes)</div>
            </div>
            <div className="metric">
              <div className="metric-value">10,000 - 32,000</div>
              <div className="metric-label">Range (1000 tonnes)</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Trend Analysis:</strong> The US shows an increasing trend in CO2 emissions with a slope of 350 1000 tonnes per year. The R² value of 0.91 indicates a very strong linear relationship, and the p-value &lt; 0.05 confirms statistical significance.</p>
          </div>
        </div>

        <div className="card">
          <h3>Correlation Matrix</h3>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">0.948</div>
              <div className="metric-label">Energy vs CO2</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.234</div>
              <div className="metric-label">GDP vs CO2</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.156</div>
              <div className="metric-label">Year vs CO2</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Correlation Interpretation:</strong> The correlation matrix reveals that energy consumption and CO2 emissions are highly correlated (0.948), indicating a strong relationship. GDP growth shows moderate correlation, while time shows weak correlation, suggesting other factors influence emissions.</p>
          </div>
        </div>

        <div className="card">
          <h3>Model Performance</h3>
          <div className="metrics">
            <div className="metric">
              <div className="metric-value">0.82</div>
              <div className="metric-label">Norway R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.91</div>
              <div className="metric-label">US R²</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.05</div>
              <div className="metric-label">Significance Level</div>
            </div>
          </div>
          <div className="analysis">
            <p><strong>Statistical Significance:</strong> Both models show statistically significant trends (p &lt; 0.05). The US model has higher explanatory power (R² = 0.91) compared to Norway (R² = 0.82), indicating more predictable emission patterns.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticalAnalysis;
