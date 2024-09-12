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

function calculateChangePercentage(data, periodDays) {
    const dates = Object.keys(data);
    const endDate = dates[0];
    const startDate = dates[periodDays - 1];
    
    if (!startDate) return null;

    const endPrice = parseFloat(data[endDate]['4. close']);
    const startPrice = parseFloat(data[startDate]['4. close']);
    
    return ((endPrice - startPrice) / startPrice * 100).toFixed(2);
}

function updateChart(symbol) {
    fetchStockData(symbol)
        .then(data => {
            const labels = [];
            const prices = [];

            for (let date in data) {
                labels.push(date);
                prices.push(data[date]['4. close']);
            }

            const colorIndex = stockSymbols.indexOf(symbol);
            const color = colors[colorIndex];

            if (stockChart) {
                stockChart.destroy();
            }

            createChart(labels.reverse(), prices.reverse(), color, symbol);

            // Update stock details
            const latestPrice = prices[0];
            document.getElementById('latestPrice').textContent = `$${latestPrice}`;
            document.getElementById('change24h').textContent = `${calculateChangePercentage(data, 1)}%`;
            document.getElementById('change7d').textContent = `${calculateChangePercentage(data, 7)}%`;
            document.getElementById('change1m').textContent = `${calculateChangePercentage(data, 30)}%`;
            document.getElementById('change3m').textContent = `${calculateChangePercentage(data, 90)}%`;
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
