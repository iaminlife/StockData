const apiKey = 'M7EWZ831WBN20B0S'; // Your API Key
const stockSymbols = ['SOXX', 'XAU', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const chartIds = ['soxxChart', 'xauChart', 'vnqiChart', 'abbvChart', 'camtChart', 'msftChart'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 215, 0, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockCharts = {};

function fetchStockData(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    
    console.log(`Fetching data for symbol: ${symbol}`); // Debugging

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(`API Response for ${symbol}:`, data); // Log API response
            return data['Global Quote'];
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateStockDetails(symbol, chartId, color) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received for', symbol);
                return;
            }

            // Extract last price and previous close from the data
            const latestPrice = parseFloat(data['05. price']);
            const previousClose = parseFloat(data['08. previous close']);

            if (isNaN(latestPrice) || isNaN(previousClose)) {
                console.error('Invalid price data for', symbol);
                return;
            }

            // Calculate the percentage change from yesterday's close
            const changePercent = ((latestPrice - previousClose) / previousClose * 100).toFixed(2);

            // Ensure the symbol is lowercase when updating the HTML
            const lowerSymbol = symbol.toLowerCase();

            // Update the HTML with the latest price and percentage change
            document.getElementById(`${lowerSymbol}Price`).textContent = `$${latestPrice}`;
            document.getElementById(`${lowerSymbol}Change`).textContent = `${changePercent}%`;

            // Create or update the chart
            const ctx = document.getElementById(chartId).getContext('2d');

            if (stockCharts[chartId]) {
                stockCharts[chartId].destroy(); // Destroy previous chart if it exists
            }

            stockCharts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Yesterday', 'Today'],
                    datasets: [{
                        label: `${symbol} Last Price: $${latestPrice}`,
                        data: [previousClose, latestPrice],
                        borderColor: color,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: { display: true },
                        y: { display: true }
                    }
                }
            });

            // Log the latest price and percentage change
            console.log(`${symbol} - Latest Price: $${latestPrice}, Change from Yesterday: ${changePercent}%`);
        })
        .catch(error => console.error('Error updating stock details:', error));
}

// Initialize charts and display last price + percentage change for all stocks
stockSymbols.forEach((symbol, index) => {
    const chartId = chartIds[index];
    const color = colors[index];

    updateStockDetails(symbol, chartId, color);
});
