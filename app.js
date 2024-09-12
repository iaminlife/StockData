const apiKey = 'NTB2LIKDMQ9N9SEX'; // เปลี่ยนเป็น API Key ของคุณ
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockChart;

function fetchStockData(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data['Time Series (Daily)'])
        .catch(error => console.error('Error fetching data:', error));
}

function updateChart(symbol) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received');
                return;
            }

            // Extract the most recent 7 days of data
            const dates = Object.keys(data);
            dates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order

            const recentDates = dates.slice(0, 7); // Get data for the most recent 7 days
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
            document.getElementById('change7d').textContent = 'N/A'; // 7 days change cannot be computed from daily data alone
            document.getElementById('change1m').textContent = 'N/A'; // 1 month change is not available
            document.getElementById('change3m').textContent = 'N/A'; // 3 months change is not available
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

// เริ่มต้นกราฟเมื่อโหลดหน้า
updateChart('SOXX');

// ฟังการเปลี่ยนแปลงของการเลือกหุ้น
document.getElementById('stockSelect').addEventListener('change', (event) => {
    updateChart(event.target.value);
});
