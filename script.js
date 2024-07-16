document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('transaction-table')) {
        initTransactionPage();
    } else if (document.getElementById('customer-details')) {
        initCustomerDetailsPage();
    }

    function initTransactionPage() {
        let customers = [];
        let transactions = [];

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                customers = data.customers;
                transactions = data.transactions;
                displayTable(transactions);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        const tableBody = document.getElementById('transaction-table');
        const searchInput = document.getElementById('search');

        function displayTable(data) {
            tableBody.innerHTML = '';
            data.forEach(transaction => {
                const customer = customers.find(c => c.id === transaction.customer_id);
                const row = document.createElement('tr');
                row.classList.add('cursor-pointer'); 
                row.innerHTML = `
                    <td class="text-center">${customer.name}</td>
                    <td class="text-center">${transaction.date}</td>
                    <td class="text-center">${transaction.amount} $</td>
                `;
                row.addEventListener('click', () => {
                   
                    window.location.href = `customer-details.html?id=${customer.id}`;
                });
                tableBody.appendChild(row);
            });
        }

        function filterTable() {
            const filterText = searchInput.value.toLowerCase();
            const filteredTransactions = transactions.filter(transaction => {
                const customer = customers.find(c => c.id === transaction.customer_id);
                return customer.name.toLowerCase().includes(filterText) ||
                    transaction.amount.toString().includes(filterText);
            });
            displayTable(filteredTransactions);
        }

        searchInput.addEventListener('input', filterTable);
    }

    function initCustomerDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const customerId = urlParams.get('id');

        let customer;
        let transactions = [];
        let chart;
        let currentChartType = 'bar'; 

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                customer = data.customers.find(c => c.id === parseInt(customerId));
                transactions = data.transactions.filter(t => t.customer_id === parseInt(customerId));
                if (customer && transactions.length > 0) {
                    displayCustomerDetails(customer);
                    displayChart(transactions, currentChartType);
                } else {
                    console.error('Customer or transactions not found');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        const customerDetailsDiv = document.getElementById('customer-details');
        const chartCanvasElement = document.getElementById('transactionChart');

        function displayCustomerDetails(customer) {
            if (!customerDetailsDiv) {
                console.error('Customer details element not found');
                return;
            }
            let image ;
            if (customer.gendar == "m"){
                image = "img/man.png";
            }
            else{
                image = "img/femail.png";
            }
              customerDetailsDiv.innerHTML = `
                <div class="card-header bg-primary text-white ">
                    ${customer.name} Details
                </div>
                <div class="card-body d-flex justify-content-between">
                <div class="">
                    <p><strong>ID:</strong> ${customer.id}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                    <p><strong>Gendar:</strong> ${customer.gendar}</p>\
                </div>
                <div class="">
                <img src="${image}" alt="">
                </div>
                </div>
            `;
        }

        function displayChart(transactions, chartType) {
            const transactionDates = transactions.map(t => t.date);
            const transactionAmounts = transactions.map(t => t.amount);

            if (!chartCanvasElement) {
                console.error('Chart canvas element not found');
                return;
            }
            const chartCanvas = chartCanvasElement.getContext('2d');

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(chartCanvas, {
              type: chartType,
              data: {
                labels: transactionDates,
                datasets: [
                  {
                    label: "Transaction Amount",
                    data: transactionAmounts,

                    fill: true,
                    borderColor: "#007bff",
                    borderWidth: 2,
                    hoverBackgroundColor: "#007bff",
                    hoverBorderColor: "#007bff",
                  },
                ],
              },
              options: {
                responsive: true,
                legend: {
                  position: "top",
                  labels: {
                    fontColor: "#333",
                    fontSize: 16,
                  },
                },
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        display: false,
                      },
                      ticks: {
                        fontColor: "#333",
                        fontSize: 14,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      gridLines: {
                        color: "rgba(200, 200, 200, 0.3)",
                      },
                      ticks: {
                        beginAtZero: true,
                        fontColor: "#333",
                        fontSize: 14,
                      },
                    },
                  ],
                },
                tooltips: {
                  enabled: true,
                  mode: "nearest",
                  intersect: false,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleFontColor: "#fff",
                  bodyFontColor: "#fff",
                  xPadding: 10,
                  yPadding: 10,
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            });
        }

        const toggleChartBtn = document.getElementById('toggleChartBtn');
        if (toggleChartBtn) {
            toggleChartBtn.addEventListener('click', () => {
                currentChartType = currentChartType === 'bar' ? 'line' : 'bar'; 
                displayChart(transactions, currentChartType); 
            });
        } else {
            console.error('Toggle chart button not found');
        }
    }
});
