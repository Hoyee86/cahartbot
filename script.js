const chartInput = document.querySelector(".chart-input textarea");
const sendChartBtn = document.querySelector(".chart-input span");







let userMessage;


const handleChart = () => {
    userMessage = chartInput.value.trim();
    console.log(userMessage)
}

sendChartBtn.addEventListener('click', handleChart)
