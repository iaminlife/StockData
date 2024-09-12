const apiKey = 'NTB2LIKDMQ9N9SEX'; // เปลี่ยนเป็น API Key ของคุณ
const stockSymbols = ['XAU', 'SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(255, 215, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)', 
                'rgba(255, 159, 64, 1)', 
                'rgba(153, 102, 255, 1)', 
                'rgba(255, 205, 86, 1)'];
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

            // Get the last 7 days of data
            const dates = Object.keys(data);
            dates.sort((a, b) => new Date(b) - new Date(a)); // Sort dates from most recent to oldest
            const recentDates = dates.slice(0, 7); // Last 7 days
            const labels = recentDates;
            const prices = recentDates.map(date => data[date]['4. close']);

            const colorIndex = stockSymbols.indexOf(symbol);
            const color = colors[colorIndex];

            if (stockChart) {
                stockChart.destroy();
            }

            createChart(labels.reverse(), prices.reverse(), color, symbol);

            // Update stock details
            const latestPrice = prices[prices.length - 1];
            const change24h = calculateChangePercentage(data, recentDates[recentDates.length - 2], recentDates[recentDates.length - 1]);

            document.getElementById('latestPrice').textContent = `$${latestPrice}`;
            document.getElementById('change24h').textContent = `${change24h}%`;
            document.getElementById('change7d').textContent = `${calculateChangePercentage(data, recentDates[0], recentDates[recentDates.length - 1])}%`;
            document.getElementById('change1m').textContent = 'N/A'; // ข้อมูล 1 เดือน
            document.getElementById('change3m').textContent = 'N/A'; // ข้อมูล 3 เดือน
        });
}

function calculateChangePercentage(data, startDate, endDate) {
    const startPrice = parseFloat(data[startDate]['4. close']);
    const endPrice = parseFloat(data[endDate]['4. close']);

    if (isNaN(startPrice) || isNaN(endPrice)) return 'N/A';

    return ((endPrice - startPrice) / startPrice * 100).toFixed(2);
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
