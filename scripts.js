function updateLoanAmount() {
    const loanAmountSlider = document.getElementById("loanAmountSlider");
    const loanAmount = loanAmountSlider.value;
    document.getElementById("loanAmountDisplay").textContent = `₹${loanAmount}`;
    document.getElementById("loanAmount").value = loanAmount;
}

function updateLoanAmountSlider() {
    const loanAmountInput = document.getElementById("loanAmount");
    const loanAmount = loanAmountInput.value;
    document.getElementById("loanAmountSlider").value = loanAmount;
    document.getElementById("loanAmountDisplay").textContent = `₹${loanAmount}`;
}

function updateInterestRate() {
    const interestRateSlider = document.getElementById("interestRateSlider");
    const interestRate = interestRateSlider.value;
    document.getElementById("interestRateDisplay").textContent = `${interestRate}%`;
    document.getElementById("interestRate").value = interestRate;
}

function updateInterestRateSlider() {
    const interestRateInput = document.getElementById("interestRate");
    const interestRate = interestRateInput.value;
    document.getElementById("interestRateSlider").value = interestRate;
    document.getElementById("interestRateDisplay").textContent = `${interestRate}%`;
}

function updateLoanTenureMonths() {
    const loanTenureMonthsSlider = document.getElementById("loanTenureMonthsSlider");
    const tenureMonths = loanTenureMonthsSlider.value;
    document.getElementById("loanTenureMonthsDisplay").textContent = `${tenureMonths} Month${tenureMonths > 1 ? 's' : ''}`;
}

function updateLoanTenureYears() {
    const loanTenureYearsSlider = document.getElementById("loanTenureYearsSlider");
    const tenureYears = loanTenureYearsSlider.value;
    document.getElementById("loanTenureYearsDisplay").textContent = `${tenureYears} Year${tenureYears > 1 ? 's' : ''}`;
}

function showTenureMonths() {
    document.getElementById("tenureMonths").style.display = 'block';
    document.getElementById("tenureYears").style.display = 'none';
}

function showTenureYears() {
    document.getElementById("tenureMonths").style.display = 'none';
    document.getElementById("tenureYears").style.display = 'block';
}

function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) / 12 / 100;
    const tenureMonths = document.getElementById("tenureMonths").style.display === 'block' ? 
                         parseInt(document.getElementById("loanTenureMonthsSlider").value) :
                         parseInt(document.getElementById("loanTenureYearsSlider").value) * 12;

    const emi = loanAmount * interestRate * Math.pow(1 + interestRate, tenureMonths) / (Math.pow(1 + interestRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    document.getElementById("monthlyEMI").textContent = `Monthly EMI: ₹${emi.toFixed(2)}`;
    document.getElementById("totalInterest").textContent = `Total Interest: ₹${totalInterest.toFixed(2)}`;
    document.getElementById("totalPayment").textContent = `Total Payment (Principal + Interest): ₹${totalPayment.toFixed(2)}`;

    drawEMIChart(loanAmount, totalInterest);
}

function drawEMIChart(principal, interest) {
    const ctx = document.getElementById('emiChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Interest Amount'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#4CAF50', '#FF5733'],
                hoverBackgroundColor: ['#45a049', '#ff6f4d']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}