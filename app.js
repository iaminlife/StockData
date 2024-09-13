const apiKey = 'edacab4eb3mshbbf1f0f5f694ef8p1db1dfjsn6fcc156a7a94'; // New API Key from RapidAPI
const stockSymbols = ['SOXX', 'XAUUSD', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const chartIds = ['soxxChart', 'xauChart', 'vnqiChart', 'abbvChart', 'camtChart', 'msftChart'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 215, 0, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockCharts = {};

async function fetchStockQuote(symbol) {
    const apiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${symbol}&datatype=json`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        return data['Global Quote'];
    } catch (error) {
        console.error('Error fetching quote data:', error);
    }
}

async function fetchStockHistory(symbol) {
    const apiUrl = `https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&datatype=json`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        return data['Time Series (Daily)'];
    } catch (error) {
        console.error('Error fetching historical data:', error);
    }
}

async function updateStockDetails(symbol, chartId, color) {
    const quoteData = await fetchStockQuote(symbol);
    const historyData = await fetchStockHistory(symbol);

    if (!quoteData || !historyData) {
        console.error('No data received for', symbol);
        return;
    }

    // Extract last price, previous close, and change percent from the quote data
    const latestPrice = parseFloat(quoteData['05. price']);
    const previousClose = parseFloat(quoteData['08. previous close']);
    const changePercent = quoteData['10. change percent']; // Get the percentage change directly

    // Extract the last 7 days of historical data
    const dates = Object.keys(historyData).slice(0, 7).reverse();
    const prices = dates.map(date => parseFloat(historyData[date]['4. close']));

    // Update the HTML with the latest price and percentage change
    document.getElementById(`${symbol.toLowerCase()}Price`).textContent = `$${latestPrice}`;
    document.getElementById(`${symbol.toLowerCase()}ChangePercent`).textContent = changePercent;

    // Create or update the chart
    const ctx = document.getElementById(chartId).getContext('2d');

    if (stockCharts[chartId]) {
        stockCharts[chartId].destroy(); // Destroy previous chart if it exists
    }

    stockCharts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Last 7 Days`,
                data: prices,
                borderColor: color,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { 
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: { 
                    display: true,
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });

    // Log the latest price and percentage change
    console.log(`${symbol} - Latest Price: $${latestPrice}, Change from Yesterday: ${changePercent}`);
}

// Initialize charts and display both the 7-day historical data and the latest price + percentage change for all stocks
stockSymbols.forEach((symbol, index) => {
    const chartId = chartIds[index];
    const color = colors[index];

    updateStockDetails(symbol, chartId, color);
});
