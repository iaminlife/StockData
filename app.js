const apiKey = 'NTB2LIKDMQ9N9SEX'; // Your API Key
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockChart;

function fetchStockData(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data['Time Series (5min)'])
        .catch(error => console.error('Error fetching data:', error));
}

function updateStockDetails(symbol) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received');
                return;
            }

            // Extract the most recent 7 days of data
            const dates = Object.keys(data);
            dates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order

            const recentDates = dates.slice(0, 7 * 6); // 7 days * 6 intervals per hour
            const labels = recentDates.reverse(); // Reversed for chronological order
            const prices = labels.map(date => data[date]['4. close']);

            const colorIndex = stockSymbols.indexOf(symbol);
            const color = colors[colorIndex];

            if (stockChart) {
                stockChart.destroy();
            }

            createChart(labels, prices, color, symbol);

            // Use the most recent data for displaying stock details
            const latestPrice = prices[prices.length - 1]; // Latest price is the last in the reversed array
            const previousPrice = prices[0]; // Previous price is the first in the reversed array

            const changePercentage = ((latestPrice - previousPrice) / previousPrice * 100).toFixed(2);

            document.getElementById('latestPrice').textContent = `$${latestPrice}`;
            document.getElementById('change24h').textContent = `${changePercentage}%`;

            // Placeholder for longer-term changes as intraday data does not provide this information
            document.getElementById('change7d').textContent = 'N/A';
            document.getElementById('change1m').textContent = 'N/A';
            document.getElementById('change3m').textContent = 'N/A';
        });
}

function createChart(labels, prices, color, label) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
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
}

// Initialize with default stock symbol
updateStockDetails('SOXX');

// Listen for stock selection change
document.getElementById('stockSelect').addEventListener('change', (event) => {
    updateStockDetails(event.target.value);
});
