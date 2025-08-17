import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

st.set_page_config(
    page_title="Climate Change Analysis: Comparative Study",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("Climate Change Analysis: Comparative Study")
st.markdown("**Team Members:** Abhijith Varma Mudunuri & Niaz Namdar")
st.markdown("---")

@st.cache_data
def load_data():
    co2_data = pd.read_csv('data/co2_pcap_cons.csv')
    
    energy_data = pd.read_excel('data/API_EG.USE.PCAP.KG.OE_DS2_en_excel_v2_20374.xls', skiprows=3)
    
    gdp_data = pd.read_excel('data/API_NY.GDP.PCAP.KD.ZG_DS2_en_excel_v2_122434.xls', skiprows=3)
    
    us_energy_data = pd.read_excel('data/us_energy.xls', skiprows=3)
    
    us_co2_data = pd.read_excel('invidual/yearly_co2_emissions_1000_tonnes.xlsx')
    
    us_temp_data = pd.read_csv('invidual/temperature.csv', encoding='latin-1')
    
    us_disasters_data = pd.read_csv('invidual/disasters.csv', encoding='latin-1', on_bad_lines='skip')
    
    us_energy_per_person = pd.read_excel('invidual/energy_use_per_person.xlsx')
    
    us_gdp_growth = pd.read_excel('invidual/gdp_per_capita_yearly_growth.xlsx')
    
    return (co2_data, energy_data, gdp_data, us_energy_data, 
            us_co2_data, us_temp_data, us_disasters_data, 
            us_energy_per_person, us_gdp_growth)

@st.cache_data
def clean_co2_data(df):
    df_clean = df.copy()
    
    if 'country' not in df_clean.columns:
        if df_clean.index.name == 'country':
            df_clean = df_clean.reset_index()
        elif 'Country' in df_clean.columns:
            df_clean = df_clean.rename(columns={'Country': 'country'})
        else:
            df_clean.columns = ['country'] + list(df_clean.columns[1:])
    
    year_columns = [col for col in df_clean.columns if col != 'country' and str(col).isdigit()]
    
    df_clean = df_clean.melt(id_vars=['country'], value_vars=year_columns, 
                           var_name='Year', value_name='CO2_per_capita')
    
    df_clean['Year'] = pd.to_numeric(df_clean['Year'])
    df_clean['CO2_per_capita'] = pd.to_numeric(df_clean['CO2_per_capita'], errors='coerce')
    
    df_clean = df_clean.rename(columns={'country': 'Country'})
    
    return df_clean.dropna()

@st.cache_data
def clean_worldbank_data(df, value_name):
    df_clean = df.copy()
    
    cols_to_drop = ['Country Code', 'Indicator Name', 'Indicator Code', 'Unnamed: 67']
    for col in cols_to_drop:
        if col in df_clean.columns:
            df_clean = df_clean.drop(col, axis=1)
    
    df_clean = df_clean.melt(id_vars=['Country Name'], var_name='Year', value_name=value_name)
    
    df_clean['Year'] = pd.to_numeric(df_clean['Year'], errors='coerce')
    df_clean[value_name] = pd.to_numeric(df_clean[value_name], errors='coerce')
    df_clean = df_clean.rename(columns={'Country Name': 'Country'})
    
    return df_clean.dropna()

@st.cache_data
def clean_us_co2_data(df):
    df_clean = df.copy()
    
    if df_clean.index.name == 'country' or 'country' not in df_clean.columns:
        df_clean = df_clean.reset_index()
        if df_clean.columns[0] == 'index':
            df_clean = df_clean.rename(columns={'index': 'country'})
    
    df_clean = pd.melt(df_clean, id_vars=['country'], var_name='Year', value_name='CO2_emissions_1000_tonnes')
    df_clean['Year'] = pd.to_numeric(df_clean['Year'], errors='coerce')
    df_clean = df_clean.dropna(subset=['Year', 'CO2_emissions_1000_tonnes'])
    df_clean = df_clean[df_clean['Year'] >= 1960]
    df_clean = df_clean.rename(columns={'country': 'Country'})
    
    return df_clean

@st.cache_data
def prepare_comparison_data():
    co2_data, energy_data, gdp_data, us_energy_data, us_co2_data, us_temp_data, us_disasters_data, us_energy_per_person, us_gdp_growth = load_data()
    
    co2_clean = clean_co2_data(co2_data)
    energy_clean = clean_worldbank_data(energy_data, 'Energy_use_per_capita')
    gdp_clean = clean_worldbank_data(gdp_data, 'GDP_growth')
    us_energy_clean = clean_worldbank_data(us_energy_data, 'US_Energy_use_per_capita')
    us_co2_clean = clean_us_co2_data(us_co2_data)
    
    norway_co2 = co2_clean[co2_clean['Country'].str.contains('Norway', case=False, na=False)]
    us_co2_per_capita = co2_clean[co2_clean['Country'].str.contains('United States', case=False, na=False)]
    
    norway_energy = energy_clean[energy_clean['Country'].str.contains('Norway', case=False, na=False)]
    us_energy_per_capita_global = energy_clean[energy_clean['Country'].str.contains('United States', case=False, na=False)]
    
    norway_gdp = gdp_clean[gdp_clean['Country'].str.contains('Norway', case=False, na=False)]
    us_gdp_global = gdp_clean[gdp_clean['Country'].str.contains('United States', case=False, na=False)]
    
    us_energy_filtered = us_energy_clean[us_energy_clean['Country'].str.contains('United States', case=False, na=False)]
    
    return {
        'norway_co2': norway_co2,
        'us_co2_per_capita': us_co2_per_capita,
        'norway_energy': norway_energy,
        'us_energy_per_capita_global': us_energy_per_capita_global,
        'norway_gdp': norway_gdp,
        'us_gdp_global': us_gdp_global,
        'us_energy_filtered': us_energy_filtered,
        'us_co2_clean': us_co2_clean,
        'us_temp_data': us_temp_data,
        'us_disasters_data': us_disasters_data,
        'us_energy_per_person': us_energy_per_person,
        'us_gdp_growth': us_gdp_growth
    }

def show_navigation_outline():
    st.sidebar.header("Project Outline")
    
    st.sidebar.markdown("**1. Project Overview**")
    st.sidebar.markdown("   - Data Summary")
    st.sidebar.markdown("   - Research Questions")
    
    st.sidebar.markdown("**2. Norway Analysis**")
    st.sidebar.markdown("   - CO2 Emissions")
    st.sidebar.markdown("   - Energy Use")
    st.sidebar.markdown("   - GDP Growth")
    
    st.sidebar.markdown("**3. US Analysis**")
    st.sidebar.markdown("   - CO2 Emissions")
    st.sidebar.markdown("   - Energy Use")
    st.sidebar.markdown("   - GDP Growth")
    
    st.sidebar.markdown("**4. Comparative Analysis**")
    st.sidebar.markdown("   - Side-by-Side Comparison")
    st.sidebar.markdown("   - Key Insights")
    
    st.sidebar.markdown("**5. Statistical Analysis**")
    st.sidebar.markdown("   - Descriptive Stats")
    st.sidebar.markdown("   - Trend Analysis")
    
    st.sidebar.markdown("**6. Interactive Charts**")
    st.sidebar.markdown("   - Dynamic Comparisons")
    st.sidebar.markdown("   - Correlation Analysis")

def main():
    show_navigation_outline()
    
    data = prepare_comparison_data()
    
    st.markdown("---")
    
    st.header("1. Project Overview")
    show_overview(data)
    
    st.markdown("---")
    
    st.header("2. Norway Analysis")
    show_norway_analysis(data)
    
    st.markdown("---")
    
    st.header("3. US Analysis")
    show_us_analysis(data)
    
    st.markdown("---")
    
    st.header("4. Comparative Analysis")
    show_comparative_analysis(data)
    
    st.markdown("---")
    
    st.header("5. Statistical Analysis")
    show_statistical_analysis(data)
    
    st.markdown("---")
    
    st.header("6. Interactive Charts")
    show_interactive_charts(data)

def show_overview(data):
    st.subheader("Data Summary")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Norway Data**")
        st.markdown("""
        - CO2 emissions, energy use, and GDP per capita data from global datasets
        - Disaster data from EM-DAT
        - Temperature data from the World Bank
        """)
        
        if not data['norway_co2'].empty:
            st.success(f"Norway CO2 data: {len(data['norway_co2'])} data points")
        else:
            st.error("Norway CO2 data not found")
    
    with col2:
        st.markdown("**US Data**")
        st.markdown("""
        - CO2 emissions, energy use, and GDP per capita data from global datasets
        - Disaster data from NOAA
        - Temperature data from NOAA
        """)
        
        if not data['us_co2_clean'].empty:
            st.success(f"US CO2 data: {len(data['us_co2_clean'])} data points")
        else:
            st.error("US CO2 data not found")
    
    st.subheader("Research Questions")
    st.markdown("""
    1. How do CO2 emissions compare between Norway and US over time?
    2. What are the energy consumption patterns in both countries?
    3. How do economic indicators correlate with environmental metrics?
    4. What statistical relationships exist between emissions and other variables?
    """)
    
    summary_data = []
    
    if not data['norway_co2'].empty:
        norway_years = f"{data['norway_co2']['Year'].min():.0f} - {data['norway_co2']['Year'].max():.0f}"
        norway_avg_co2 = data['norway_co2']['CO2_per_capita'].mean()
        summary_data.append({
            "Country": "Norway",
            "Data Points": len(data['norway_co2']),
            "Year Range": norway_years,
            "Avg CO2 per Capita": f"{norway_avg_co2:.2f} tons"
        })
    
    if not data['us_co2_clean'].empty:
        us_years = f"{data['us_co2_clean']['Year'].min():.0f} - {data['us_co2_clean']['Year'].max():.0f}"
        us_avg_co2 = data['us_co2_clean']['CO2_emissions_1000_tonnes'].mean()
        summary_data.append({
            "Country": "United States",
            "Data Points": len(data['us_co2_clean']),
            "Year Range": us_years,
            "Avg CO2 per Capita": f"{us_avg_co2:.2f} thousand tons"
        })
    
    if summary_data:
        summary_df = pd.DataFrame(summary_data)
        st.dataframe(summary_df, use_container_width=True)

def show_norway_analysis(data):
    st.subheader("CO2 Emissions")
    if not data['norway_co2'].empty:
        fig = px.line(data['norway_co2'], x='Year', y='CO2_per_capita',
                     title='Norway CO2 Emissions per Capita Over Time',
                     labels={'CO2_per_capita': 'CO2 per Capita (metric tons)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average CO2 per Capita", 
                 f"{data['norway_co2']['CO2_per_capita'].mean():.2f} metric tons")
        
        st.markdown("""
        **Analysis:** Norway's CO2 per capita emissions show a sharp increase during the early 1800s to mid-20th century, 
        coinciding with the country's industrialization and economic development. The emissions peaked at about 12 tons 
        per capita in 1970 before plummeting sharply and leveling off at low values. The pattern shows that Norway 
        decoupled economic growth from carbon intensity, most likely through policy intervention, technological progress, 
        and transition to cleaner energy sources such as hydroelectric power.
        """)
    else:
        st.error("Norway CO2 data not available")
    
    st.subheader("Energy Use")
    if not data['norway_energy'].empty:
        fig = px.line(data['norway_energy'], x='Year', y='Energy_use_per_capita',
                     title='Norway Energy Use per Capita Over Time',
                     labels={'Energy_use_per_capita': 'Energy Use per Capita (kg oil eq.)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average Energy Use", 
                 f"{data['norway_energy']['Energy_use_per_capita'].mean():.0f} kg oil equivalent")
        
        st.markdown("""
        **Analysis:** Energy consumption in Norway increased significantly between 1960 and the early 2000s, from about 
        2,000 kg oil equivalent to over 5,000 kg oil equivalent per capita. This increasing trend reflects the growth 
        in Norway's economy and rising levels of living standards over these decades. The level of flat growth signifies 
        balanced energy demand growth, although its abundant hydroelectric resource base made it have a cleaner energy 
        profile than fossil fuel dependent nations.
        """)
    else:
        st.error("Norway energy data not available")
    
    st.subheader("GDP Growth")
    if not data['norway_gdp'].empty:
        fig = px.line(data['norway_gdp'], x='Year', y='GDP_growth',
                     title='Norway GDP per Capita Growth Over Time',
                     labels={'GDP_growth': 'GDP Growth (%)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average GDP Growth", 
                 f"{data['norway_gdp']['GDP_growth'].mean():.2f}%")
        
        st.markdown("""
        **Analysis:** The growth of the GDP in Norway reflects the common trends in economics of growth and decline 
        from 1970 to 2010. The 2.27% average growth rate reflects steady economic growth with huge fluctuations like 
        negative growth during periods of economic downturn. Domestic business cycles and external factors like fluctuations 
        in the world price of oil deeply influence Norway's economy based on petroleum, and the growth rates fluctuate 
        correspondingly.
        """)
    else:
        st.error("Norway GDP data not available")

def show_us_analysis(data):
    st.subheader("CO2 Emissions")
    if not data['us_co2_clean'].empty:
        us_co2_by_year = data['us_co2_clean'].groupby('Year')['CO2_emissions_1000_tonnes'].sum().reset_index()
        
        fig = px.line(us_co2_by_year, x='Year', y='CO2_emissions_1000_tonnes',
                     title='US Total CO2 Emissions Over Time',
                     labels={'CO2_emissions_1000_tonnes': 'CO2 Emissions (1000 tonnes)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average Total CO2", 
                 f"{us_co2_by_year['CO2_emissions_1000_tonnes'].mean():.0f} thousand tonnes")
        
        st.markdown("""
        **Analysis:** The United States showcases a consistent increasing trend in total CO2 emissions between 1960 and 2000, 
        from approximately 10 million to over 30 million thousand tonnes. This unequivocal rise reflects the country's large 
        population, industrialization, and energy-intensive economic activities. The scale of US emissions, several orders of 
        magnitude greater than that of Norway, serves to highlight the significant roles played by large economies in carbon 
        emissions and climate change across the globe.
        """)
    else:
        st.error("US CO2 data not available")
    
    st.subheader("Energy Use")
    if not data['us_energy_filtered'].empty:
        fig = px.line(data['us_energy_filtered'], x='Year', y='US_Energy_use_per_capita',
                     title='US Energy Use per Capita Over Time',
                     labels={'US_Energy_use_per_capita': 'Energy Use per Capita (kg oil eq.)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average Energy Use", 
                 f"{data['us_energy_filtered']['US_Energy_use_per_capita'].mean():.0f} kg oil equivalent")
        
        st.markdown("""
        **Analysis:** Average American energy consumption reflects rather high but stable consumption patterns ranging 
        from 5,500 to 8,500 kg oil equivalent throughout the period 1960-2010. Both peak and decline are registered 
        in the figures with substantial peaks in some decades. This picture testifies that although overall consumption 
        was rather high by world standards, there was some increase in efficiency and behavior change in the US that 
        prevented steady exponential growth in per capita consumption.
        """)
    else:
        st.error("US energy data not available")
    
    st.subheader("GDP Growth")
    if not data['us_gdp_global'].empty:
        fig = px.line(data['us_gdp_global'], x='Year', y='GDP_growth',
                     title='US GDP per Capita Growth Over Time',
                     labels={'GDP_growth': 'GDP Growth (%)', 'Year': 'Year'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        
        st.metric("Average GDP Growth", 
                 f"{data['us_gdp_global']['GDP_growth'].mean():.2f}%")
        
        st.markdown("""
        **Analysis:** The US economic growth captures characteristic patterns of business cycles with recurring periods 
        of expansion and recession between 1970 and 2010. The average growth rate at 2.01% indicates mature economy 
        growth, and the volatility registers normal fluctuations of a large and diversified economy to varied internal 
        and external shocks including financial crises, policy shifts, and global economic conditions.
        """)
    else:
        st.error("US GDP data not available")

def show_comparative_analysis(data):
    st.subheader("Side-by-Side Comparison")
    
    if not data['norway_co2'].empty and not data['us_co2_clean'].empty:
        comparison_data = []
        
        norway_yearly = data['norway_co2'].groupby('Year')['CO2_per_capita'].mean().reset_index()
        norway_yearly['Country'] = 'Norway'
        norway_yearly['Metric'] = 'CO2 per Capita (tons)'
        norway_yearly['Value'] = norway_yearly['CO2_per_capita']
        
        us_yearly = data['us_co2_clean'].groupby('Year')['CO2_emissions_1000_tonnes'].sum().reset_index()
        us_yearly['Country'] = 'United States'
        us_yearly['Metric'] = 'Total CO2 (1000 tonnes)'
        us_yearly['Value'] = us_yearly['CO2_emissions_1000_tonnes']
        
        comparison_df = pd.concat([norway_yearly[['Year', 'Country', 'Metric', 'Value']], 
                                 us_yearly[['Year', 'Country', 'Metric', 'Value']]])
        
        fig = px.line(comparison_df, x='Year', y='Value', color='Country',
                     title='CO2 Emissions Comparison: Norway vs US',
                     labels={'Value': 'CO2 Emissions', 'Year': 'Year'})
        fig.update_layout(height=500)
        st.plotly_chart(fig, use_container_width=True)
        
        st.markdown("**Key Insights:**")
        st.markdown("""
        **Analysis:** Comparison reveals fundamentally disparate scales and patterns between the two countries. 
        The US shows enormous absolute emissions much greater than the Norwegian contribution, how a comparison 
        encompassing both total and per capita measurements presents an important consideration in judging national 
        climate impacts. The enormously disparate scales make direct comparison difficult but emphasize how heavy 
        economies unproportionally raise global emissions.
        """)
    
    st.subheader("Energy vs CO2 Correlation")
    
    if not data['norway_energy'].empty and not data['norway_co2'].empty:
        norway_merged = data['norway_energy'].merge(data['norway_co2'], on=['Country', 'Year'], how='inner')
        
        if not norway_merged.empty:
            fig = px.scatter(norway_merged, x='Energy_use_per_capita', y='CO2_per_capita',
                           title='Norway: Energy Use vs CO2 Emissions per Capita',
                           labels={'Energy_use_per_capita': 'Energy Use per Capita (kg oil eq.)',
                                  'CO2_per_capita': 'CO2 per Capita (metric tons)'})
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
            
            correlation = norway_merged['Energy_use_per_capita'].corr(norway_merged['CO2_per_capita'])
            st.metric("Correlation Coefficient", f"{correlation:.3f}")
            
            if abs(correlation) > 0.7:
                strength = "Strong"
            elif abs(correlation) > 0.5:
                strength = "Moderate"
            else:
                strength = "Weak"
            
            st.info(f"**Correlation Strength:** {strength}")
            
            st.markdown("""
            **Analysis:** The strong positive correlation (r = 0.948) between energy use and per capita CO2 emissions 
            in Norway demonstrates the underlying relationship between carbon emissions and energy use. The relationship 
            suggests that despite Norway's relatively clean energy mix, more energy use equals more emissions, probably 
            due to industry, transport energy use, and energy imported into Norway. The strong correlation suggests 
            orderly patterns in the manner by which energy use results in emissions in the long term.
            """)

def show_statistical_analysis(data):
    st.subheader("Descriptive Statistics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Norway Statistics**")
        if not data['norway_co2'].empty:
            norway_stats = data['norway_co2']['CO2_per_capita'].describe()
            st.write("CO2 per Capita (metric tons):")
            st.write(f"- Mean: {norway_stats['mean']:.2f}")
            st.write(f"- Median: {norway_stats['50%']:.2f}")
            st.write(f"- Std Dev: {norway_stats['std']:.2f}")
            st.write(f"- Min: {norway_stats['min']:.2f}")
            st.write(f"- Max: {norway_stats['max']:.2f}")
        else:
            st.error("Norway data not available")
    
    with col2:
        st.markdown("**US Statistics**")
        if not data['us_co2_clean'].empty:
            us_stats = data['us_co2_clean']['CO2_emissions_1000_tonnes'].describe()
            st.write("Total CO2 Emissions (1000 tonnes):")
            st.write(f"- Mean: {us_stats['mean']:.0f}")
            st.write(f"- Median: {us_stats['50%']:.0f}")
            st.write(f"- Std Dev: {us_stats['std']:.0f}")
            st.write(f"- Min: {us_stats['min']:.0f}")
            st.write(f"- Max: {us_stats['max']:.0f}")
        else:
            st.error("US data not available")
    
    st.subheader("Trend Analysis")
    
    if not data['norway_co2'].empty:
        norway_yearly_avg = data['norway_co2'].groupby('Year')['CO2_per_capita'].mean().reset_index()
        
        if len(norway_yearly_avg) > 5:
            slope, intercept, r_value, p_value, std_err = stats.linregress(
                norway_yearly_avg['Year'], norway_yearly_avg['CO2_per_capita']
            )
            
            st.markdown("**Norway CO2 Trend Analysis**")
            st.write(f"- **Slope:** {slope:.4f} (tons per year)")
            st.write(f"- **R-squared:** {r_value**2:.4f}")
            st.write(f"- **P-value:** {p_value:.4f}")
            
            if p_value < 0.05:
                st.success("Trend is statistically significant")
            else:
                st.warning("Trend is not statistically significant")
            
            if slope > 0:
                st.info("**Trend:** Increasing CO2 emissions over time")
            else:
                st.info("**Trend:** Decreasing CO2 emissions over time")
    
    if not data['us_co2_clean'].empty:
        us_yearly_total = data['us_co2_clean'].groupby('Year')['CO2_emissions_1000_tonnes'].sum().reset_index()
        
        if len(us_yearly_total) > 5:
            slope, intercept, r_value, p_value, std_err = stats.linregress(
                us_yearly_total['Year'], us_yearly_total['CO2_emissions_1000_tonnes']
            )
            
            st.markdown("**US CO2 Trend Analysis**")
            st.write(f"- **Slope:** {slope:.2f} (1000 tonnes per year)")
            st.write(f"- **R-squared:** {r_value**2:.4f}")
            st.write(f"- **P-value:** {p_value:.4f}")
            
            if p_value < 0.05:
                st.success("Trend is statistically significant")
            else:
                st.warning("Trend is not statistically significant")
            
            if slope > 0:
                st.info("**Trend:** Increasing CO2 emissions over time")
            else:
                st.info("**Trend:** Decreasing CO2 emissions over time")

def show_interactive_charts(data):
    st.subheader("Dynamic Comparisons")
    
    if not data['norway_co2'].empty and not data['us_co2_clean'].empty:
        comparison_type = st.selectbox(
            "Choose comparison type:",
            ["CO2 Emissions", "Energy Consumption", "GDP Growth"]
        )
        
        if comparison_type == "CO2 Emissions":
            norway_data = data['norway_co2'].copy()
            norway_data['Metric'] = 'CO2 per Capita (tons)'
            norway_data['Value'] = norway_data['CO2_per_capita']
            
            us_data = data['us_co2_clean'].groupby('Year')['CO2_emissions_1000_tonnes'].sum().reset_index()
            us_data['Country'] = 'United States'
            us_data['Metric'] = 'Total CO2 (1000 tonnes)'
            us_data['Value'] = us_data['CO2_emissions_1000_tonnes']
            
            combined_data = pd.concat([
                norway_data[['Year', 'Country', 'Metric', 'Value']],
                us_data[['Year', 'Country', 'Metric', 'Value']]
            ])
            
            fig = px.line(combined_data, x='Year', y='Value', color='Country',
                         title=f'{comparison_type}: Norway vs US Comparison',
                         labels={'Value': comparison_type, 'Year': 'Year'})
            
            fig.update_layout(height=600)
            st.plotly_chart(fig, use_container_width=True)
    
    st.subheader("Correlation Analysis")
    
    if not data['norway_co2'].empty and not data['norway_energy'].empty:
        norway_merged = data['norway_co2'].merge(data['norway_energy'], on=['Country', 'Year'], how='inner')
        
        if not norway_merged.empty and len(norway_merged) > 5:
            correlation_vars = ['CO2_per_capita', 'Energy_use_per_capita', 'Year']
            correlation_data = norway_merged[correlation_vars].corr()
            
            fig = px.imshow(correlation_data,
                           title='Norway: Variable Correlation Matrix',
                           color_continuous_scale='RdBu',
                           aspect='auto')
            
            fig.update_layout(height=500)
            st.plotly_chart(fig, use_container_width=True)
            
            st.markdown("**Correlation Interpretation:**")
            st.markdown("""
            **Analysis:** The correlation matrix of environmental and economic variables in Norway reveals the interrelatedness 
            of the variables. The very high correlations among some of the variables reveal that energy consumption, emissions, 
            and economic activities all trend together in a predictable manner. Upon analysis, it can be utilized to identify 
            which variables are most highly correlated and can inform policy decisions about where interventions can be most 
            effective for supporting both environmental and economic goals.
            """)
    
    st.subheader("Time Series Decomposition")
    
    if not data['norway_co2'].empty:
        norway_yearly = data['norway_co2'].groupby('Year')['CO2_per_capita'].mean().reset_index()
        
        if len(norway_yearly) > 10:
            fig = make_subplots(rows=3, cols=1, 
                              subplot_titles=('Original Time Series', 'Trend Component', 'Residuals'),
                              vertical_spacing=0.1)
            
            fig.add_trace(go.Scatter(x=norway_yearly['Year'], y=norway_yearly['CO2_per_capita'],
                                   name='Original', line=dict(color='blue')), row=1, col=1)
            
            slope, intercept, _, _, _ = stats.linregress(norway_yearly['Year'], norway_yearly['CO2_per_capita'])
            trend = slope * norway_yearly['Year'] + intercept
            fig.add_trace(go.Scatter(x=norway_yearly['Year'], y=trend,
                                   name='Trend', line=dict(color='red')), row=2, col=1)
            
            residuals = norway_yearly['CO2_per_capita'] - trend
            fig.add_trace(go.Scatter(x=norway_yearly['Year'], y=residuals,
                                   name='Residuals', line=dict(color='green')), row=3, col=1)
            
            fig.update_layout(height=800, title_text="Norway CO2 Emissions: Time Series Decomposition")
            st.plotly_chart(fig, use_container_width=True)
            
            st.markdown("""
            **Analysis:** The decomposition splits Norway's CO2 emissions into trend, seasonal, and residual components. 
            The trend component is the long-run trajectory of emissions, and the residuals are information about short-run 
            deviations from the overall trend not explained by the trend component. Decomposition enables structural shifts 
            in emission trends to be separated from temporary fluctuations, and it informs analysis of the effectiveness 
            of long-run climate policies relative to short-run economic or social influences.
            """)

if __name__ == "__main__":
    main()
