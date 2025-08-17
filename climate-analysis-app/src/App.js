import React, { useEffect } from 'react';
import './App.css';
import Hero from './components/Hero';
import Overview from './components/Overview';
import NorwayAnalysis from './components/NorwayAnalysis';
import USAnalysis from './components/USAnalysis';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import StatisticalAnalysis from './components/StatisticalAnalysis';
import MachineLearning from './components/MachineLearning';

function App() {

    useEffect(() => {
    // Simple fade-in animations using CSS classes
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Hero />
      <Overview />
      <NorwayAnalysis />
      <USAnalysis />
      <ComparativeAnalysis />
      <StatisticalAnalysis />
      <MachineLearning />
    </div>
  );
}

export default App;
