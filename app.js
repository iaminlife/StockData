// ใส่หุ้นที่ต้องการดึงข้อมูล
const stockSymbols = ['SOXX', 'VNQI', 'ABBV', 'CAMT', 'MSFT'];
const apiKey = 'NTB2LIKDMQ9N9SEX';

// สีที่กำหนดให้แต่ละหุ้น
const stockColors = {
    'SOXX': 'rgba(255, 99, 132, 1)',
    'VNQI': 'rgba(54, 162, 235, 1)',
    'ABBV': 'rgba(255, 206, 86, 1)',
    'CAMT': 'rgba(75, 192, 192, 1)',
    'MSFT': 'rgba(153, 102, 255, 1)'
};

// ฟังก์ชันดึงข้อมูลหุ้นจาก API
function fetchStockData(stockSymbol) {
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data['Time Series (Daily)'];
            const labels = [];
            const prices = [];

            for (let date in timeSeries) {
                labels.push(date);
                prices.push(timeSeries[date]['4. close']);
            }

            return { labels: labels.reverse(), prices: prices.reverse() }; // รีเวิร์สข้อมูลเพื่อเรียงจากเก่ามาใหม่
        });
}

// ฟังก์ชันสร้างกราฟ
function createChart(stockSymbol, labels, prices) {
    const ctx = document.getElementById(`${stockSymbol}Chart`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${stockSymbol} Stock Price`,
                data: prices,
                borderColor: stockColors[stockSymbol], // สีของแต่ละหุ้น
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

// เรียกฟังก์ชันเพื่อดึงข้อมูลและสร้างกราฟสำหรับแต่ละหุ้น
stockSymbols.forEach(stockSymbol => {
    fetchStockData(stockSymbol)
        .then(data => {
            createChart(stockSymbol, data.labels, data.prices); // สร้างกราฟเมื่อดึงข้อมูลเสร็จ
        })
        .catch(error => console.error(`Error fetching data for ${stockSymbol}:`, error));
});
