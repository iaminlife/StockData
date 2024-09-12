const apiKey = 'NTB2LIKDMQ9N9SEX'; // Your API Key
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockChart;

function fetchStockData(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data['Global Quote'])
        .catch(error => console.error('Error fetching data:', error));
}

function updateStockDetails(symbol) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received');
                return;
            }

            const latestPrice = data['05. price'];
            const previousClose = data['08. previous close'];
            const change24h = data['09. change'];
            const change24hPercent = data['10. change percent'];

            document.getElementById('latestPrice').textContent = `$${latestPrice}`;
            document.getElementById('change24h').textContent = `${change24hPercent}`;
            
            // Set placeholders for longer-term changes as GLOBAL_QUOTE does not provide this data
            document.getElementById('change7d').textContent = 'N/A';
            document.getElementById('change1m').textContent = 'N/A';
            document.getElementById('change3m').textContent = 'N/A';
            
            // Since we cannot plot historical data with GLOBAL_QUOTE, we skip chart plotting
            if (stockChart) {
                stockChart.destroy();
            }
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
