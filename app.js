const apiKey = 'NTB2LIKDMQ9N9SEX'; // เปลี่ยนเป็น API Key ของคุณ
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

function calculateChangePercentage(data, startTime, endTime) {
    const startData = data[startTime];
    const endData = data[endTime];

    if (!startData || !endData) return 'N/A'; // ตรวจสอบว่าข้อมูลมีหรือไม่

    const startPrice = parseFloat(startData['4. close']);
    const endPrice = parseFloat(endData['4. close']);

    if (isNaN(startPrice) || isNaN(endPrice)) return 'N/A'; // ตรวจสอบว่า startPrice และ endPrice มีค่าหรือไม่

    return ((endPrice - startPrice) / startPrice * 100).toFixed(2);
}

function updateChart(symbol) {
    fetchStockData(symbol)
        .then(data => {
            if (!data) {
                console.error('No data received');
                return;
            }

            const timestamps = Object.keys(data);
            timestamps.sort((a, b) => new Date(b) - new Date(a)); // เรียงลำดับตามเวลา

            const labels = timestamps.slice(0, 20); // ใช้ข้อมูลล่าสุด 20 ช่วงเวลา
            const prices = labels.map(timestamp => data[timestamp]['4. close']);

            const colorIndex = stockSymbols.indexOf(symbol);
            const color = colors[colorIndex];

            if (stockChart) {
                stockChart.destroy();
            }

            createChart(labels, prices, color, symbol);

            // ใช้ข้อมูลล่าสุดในการคำนวณการเปลี่ยนแปลง
            const latestTimestamp = timestamps[0];
            const earliestTimestamp = timestamps[timestamps.length - 1];

            document.getElementById('latestPrice').textContent = `$${prices[0]}`;
            document.getElementById('change24h').textContent = `${calculateChangePercentage(data, earliestTimestamp, latestTimestamp)}%`;
            document.getElementById('change7d').textContent = 'N/A'; // ข้อมูล 7 วันไม่สามารถดึงจากช่วงเวลานี้ได้
            document.getElementById('change1m').textContent = 'N/A'; // ข้อมูล 1 เดือนไม่สามารถดึงจากช่วงเวลานี้ได้
            document.getElementById('change3m').textContent = 'N/A'; // ข้อมูล 3 เดือนไม่สามารถดึงจากช่วงเวลานี้ได้
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
