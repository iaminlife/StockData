const apiKey = 'NTB2LIKDMQ9N9SEX'; // เปลี่ยนเป็น API Key ของคุณ
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

function updateChart(symbol) {
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

            // คำนวณการเปลี่ยนแปลงในช่วงเวลาอื่น (จำเป็นต้องมีข้อมูลเพิ่มเติมในการคำนวณนี้)
            // ตัวอย่างนี้จะคำนวณเฉพาะการเปลี่ยนแปลงในช่วง 24 ชั่วโมง

            document.getElementById('latestPrice').textContent = `$${latestPrice}`;
            document.getElementById('change24h').textContent = `${change24hPercent}`;

            // เนื่องจากข้อมูลใน JSON นี้ไม่ครอบคลุม 7 วัน, 1 เดือน, 3 เดือน เราจึงไม่สามารถคำนวณได้จากข้อมูลนี้
            document.getElementById('change7d').textContent = 'N/A';
            document.getElementById('change1m').textContent = 'N/A';
            document.getElementById('change3m').textContent = 'N/A';

            // สร้างกราฟ
            // คุณต้องใช้ข้อมูลย้อนหลังในการสร้างกราฟ
            // ดังนั้นคุณอาจต้องใช้ API อื่นที่ให้ข้อมูลย้อนหลัง หรือแสดงกราฟสำหรับหุ้นเดียว
        });
}

// เริ่มต้นกราฟเมื่อโหลดหน้า
updateChart('SOXX');

// ฟังการเปลี่ยนแปลงของการเลือกหุ้น
document.getElementById('stockSelect').addEventListener('change', (event) => {
    updateChart(event.target.value);
});
