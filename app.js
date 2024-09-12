const apiKey = 'NTB2LIKDMQ9N9SEX';
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];

// กำหนดชุดสีสำหรับแต่ละกราฟ
const colors = {
    'SOXX': 'rgba(75, 192, 192, 1)',
    'VNQI': 'rgba(255, 99, 132, 1)',
    'ABBV': 'rgba(54, 162, 235, 1)',
    'CAMT': 'rgba(255, 206, 86, 1)',
    'MSFT': 'rgba(153, 102, 255, 1)'
};

// ลูปเพื่อดึงข้อมูลและสร้างกราฟสำหรับแต่ละหุ้น
stockSymbols.forEach(symbol => {
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

            createChart(symbol, labels.reverse(), prices.reverse()); // สร้างกราฟสำหรับแต่ละหุ้น
        })
        .catch(error => console.error('Error fetching data:', error));
});

// ฟังก์ชันสร้างกราฟ
function createChart(symbol, labels, prices) {
    const ctx = document.getElementById(`stockChart${symbol}`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol} Stock Price`,
                data: prices,
                borderColor: colors[symbol], // ใช้สีจากชุดสีที่กำหนด
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
