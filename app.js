const apiKey = 'NTB2LIKDMQ9N9SEX'; // Your API Key
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockCharts = {};

function fetchStockData(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data['Time Series (5min)'])
        .catch(error => console.error('Error fetching data:', error));
}

function updateStockDetails(symbol, chartId, color) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received');
                return;
            }

            // Extract the most recent 7 days of data (or modify for a shorter period)
            const dates = Object.keys(data);
            dates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order

            const recentDates = dates.slice(0, 7 * 6); // 7 days * 6 intervals per hour
            const labels = recentDates.reverse(); // Reversed for chronological order
            const prices = labels.map(date => data[date]['4. close']);

            const ctx = document.getElementById(chartId).getContext('2d');

            if (stockCharts[chartId]) {
                stockCharts[chartId].destroy(); // Destroy previous chart if it exists
            }

            stockCharts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: symbol,
                        data: prices,
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

            // Optional: Use the most recent data for displaying stock details
            const latestPrice = prices[prices.length - 1];
            const previousPrice = prices[0];

            const changePercentage = ((latestPrice - previousPrice) / previousPrice * 100).toFixed(2);

            // Display latest price and change (optional, customize as needed)
            console.log(`${symbol} - Latest Price: $${latestPrice}, Change: ${changePercentage}%`);
        });
}

// Initialize charts for all stocks
stockSymbols.forEach((symbol, index) => {
    const chartId = symbol.toLowerCase() + 'Chart'; // e.g., soxxChart, vnqiChart
    const color = colors[index];

    updateStockDetails(symbol, chartId, color);
});
