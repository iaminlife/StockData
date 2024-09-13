const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=XegPEFhdN03JftEQRzIZa_wwWOQRP2ICCxbhXlEaseDrPlVDUWn0sWLv--cW1gielWehhr4Pr1ZDoCtA5Cp6GpDw1lmYjFIJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBoqvUlA5gTZr2_qSHaeFYpsaba98NHqS56QQdPXxx4u3F-X8WTYPuUIu2CLu-rDiuE4L2YF7iW5y0nc7WpMp4HLF9o4GghCmtz9Jw9Md8uu&lib=MkQ67RdKM9ulSA3tLiHXzWJO8VLt0Rle7';

async function fetchStockData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stock data from API:', error);
    }
}

async function updateStockDetailsFromAPI(symbol, chartId, color) {
    const stockData = await fetchStockData();
    if (!stockData || !stockData[symbol]) {
        console.error(`No data found for ${symbol}`);
        return;
    }

    const historyData = stockData[symbol];
    const latestData = historyData[historyData.length - 1];
    const latestPrice = latestData.price;

    const recentData = historyData.slice(-7);
    const dates = recentData.map(entry => entry.date);
    const prices = recentData.map(entry => entry.price);

    document.getElementById(`${symbol.toLowerCase()}Price`).textContent = `$${latestPrice}`;

    const ctx = document.getElementById(chartId).getContext('2d');
    if (stockCharts[chartId]) {
        stockCharts[chartId].destroy();
    }

    stockCharts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Last 7 Days`,
                data: prices,
                borderColor: color,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { display: true, title: { display: true, text: 'Date' } },
                y: { display: true, title: { display: true, text: 'Price' } }
            }
        }
    });
}

stockSymbols.forEach((symbol, index) => {
    const chartId = chartIds[index];
    const color = colors[index];
    updateStockDetailsFromAPI(symbol, chartId, color);
});
