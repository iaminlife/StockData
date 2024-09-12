// ดึงข้อมูลจาก Alpha Vantage API
const apiKey = 'NTB2LIKDMQ9N9SEX';
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT']; // สัญลักษณ์หุ้นที่ต้องการ

// ฟังก์ชันดึงข้อมูลหุ้น
function fetchStockData(symbol) {
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

            createChart(symbol, labels.reverse(), prices.reverse()); // สร้างกราฟโดยใช้ข้อมูลที่ดึงมา
        })
        .catch(error => console.error(`Error fetching data for ${symbol}:`, error));
}

// ฟังก์ชันสร้างกราฟ
function createChart(symbol, labels, prices) {
    const ctx = document.getElementById(`chart_${symbol}`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol} Stock Price`,
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

// ดึงข้อมูลหุ้นทุกตัวที่กำหนด
stockSymbols.forEach(symbol => fetchStockData(symbol));
