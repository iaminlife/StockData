const apiKey = '0PLKPLMVJ95V236K'; // เปลี่ยนเป็น API Key ของคุณ
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'];
let stockChart;

// ฟังก์ชันสำหรับดึงข้อมูลและอัพเดตกราฟ
function updateChart(symbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data['Time Series (Daily)'];
            const labels = [];
            const prices = [];

            for (let date in timeSeries) {
                labels.push(date);
                prices.push(timeSeries[date]['4. close']);
            }

            const colorIndex = stockSymbols.indexOf(symbol);
            const color = colors[colorIndex];

            if (stockChart) {
                stockChart.destroy(); // ทำลายกราฟเดิม
            }

            createChart(labels.reverse(), prices.reverse(), color, symbol);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// ฟังก์ชันสร้างกราฟ
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
