// ดึงข้อมูลจาก Alpha Vantage API
const apiKey = 'YOUR_API_KEY';
const stockSymbol = 'AAPL'; // สัญลักษณ์หุ้นที่ต้องการ
const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;

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

        createChart(labels.reverse(), prices.reverse()); // สร้างกราฟโดยใช้ข้อมูลที่ดึงมา
    })
    .catch(error => console.error('Error fetching data:', error));

// ฟังก์ชันสร้างกราฟ
function createChart(labels, prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
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
