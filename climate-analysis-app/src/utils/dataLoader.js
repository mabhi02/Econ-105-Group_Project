import Papa from 'papaparse';

export const loadClimateData = async () => {
  try {
    const norwayCo2Response = await fetch('/data/co2_pcap_cons.csv');
    const norwayCo2Text = await norwayCo2Response.text();
    const norwayCo2Data = Papa.parse(norwayCo2Text, { header: true });
    
    const usTempResponse = await fetch('/invidual/us_temperature.csv');
    const usTempText = await usTempResponse.text();
    const usTempData = Papa.parse(usTempText, { header: true });
    
    const usCo2Response = await fetch('/invidual/us_co2_emissions.csv');
    const usCo2Text = await usCo2Response.text();
    const usCo2Data = Papa.parse(usCo2Text, { header: true });
    
    const usEnergyResponse = await fetch('/invidual/us_energy_use.csv');
    const usEnergyText = await usEnergyResponse.text();
    const usEnergyData = Papa.parse(usEnergyText, { header: true });
    
    return {
      norwayCo2: norwayCo2Data.data,
      usTemp: usTempData.data,
      usCo2: usCo2Data.data,
      usEnergy: usEnergyData.data
    };
  } catch (error) {
    console.error('Error loading climate data:', error);
    return null;
  }
};

export const processNorwayData = (rawData) => {
  if (!rawData || !rawData.norwayCo2) return null;
  
  const norwayRow = rawData.norwayCo2.find(row => 
    row.country && row.country.toLowerCase().includes('norway')
  );
  
  if (!norwayRow) return null;
  
  const processedData = [];
  Object.keys(norwayRow).forEach(key => {
    if (key !== 'country' && !isNaN(key) && !isNaN(norwayRow[key])) {
      processedData.push({
        year: parseInt(key),
        co2: parseFloat(norwayRow[key])
      });
    }
  });
  
  return processedData.sort((a, b) => a.year - b.year);
};

export const processUSData = (rawData) => {
  if (!rawData || !rawData.usTemp) return null;
  
  const processedData = [];
  rawData.usTemp.forEach(row => {
    if (row.Date && row.Value && !isNaN(parseFloat(row.Value))) {
      const year = parseInt(row.Date.toString().substring(0, 4));
      const temp = parseFloat(row.Value);
      if (year >= 1900 && year <= 2020) {
        processedData.push({
          year: year,
          temperature: temp
        });
      }
    }
  });
  
  return processedData.sort((a, b) => a.year - b.year);
};

export const processNorwayEnergyData = (rawData) => {
  const sampleEnergyData = [
    { year: 1960, energy: 2000 },
    { year: 1970, energy: 2500 },
    { year: 1980, energy: 3000 },
    { year: 1990, energy: 4000 },
    { year: 2000, energy: 5000 },
    { year: 2010, energy: 4800 }
  ];
  return sampleEnergyData;
};

export const processNorwayGdpData = (rawData) => {
  const sampleGdpData = [
    { year: 1970, gdp: 2.5 },
    { year: 1980, gdp: 3.1 },
    { year: 1990, gdp: 2.8 },
    { year: 2000, gdp: 3.4 },
    { year: 2010, gdp: 2.9 }
  ];
  return sampleGdpData;
};

export const processUSCo2Data = (rawData) => {
  if (!rawData || !rawData.usCo2) return null;
  
  const processedData = [];
  rawData.usCo2.forEach(row => {
    if (row.Year && row.CO2_Emissions && !isNaN(parseInt(row.Year)) && !isNaN(parseFloat(row.CO2_Emissions))) {
      processedData.push({
        year: parseInt(row.Year),
        co2: parseFloat(row.CO2_Emissions)
      });
    }
  });
  
  return processedData.sort((a, b) => a.year - b.year);
};

export const processUSEnergyData = (rawData) => {
  if (!rawData || !rawData.usEnergy) return null;
  
  const processedData = [];
  rawData.usEnergy.forEach(row => {
    if (row.Year && row.Energy_Use && !isNaN(parseInt(row.Year)) && !isNaN(parseFloat(row.Energy_Use))) {
      processedData.push({
        year: parseInt(row.Year),
        energy: parseFloat(row.Energy_Use)
      });
    }
  });
  
  return processedData.sort((a, b) => a.year - b.year);
};
