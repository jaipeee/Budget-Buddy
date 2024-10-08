// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6rU0yIAPnk_skJpH1HlvJo_K6U_zElLk",
    authDomain: "budget-buddy-404cc.firebaseapp.com",
    databaseURL: "https://budget-buddy-404cc-default-rtdb.firebaseio.com",
    projectId: "budget-buddy-404cc",
    storageBucket: "budget-buddy-404cc.appspot.com",
    messagingSenderId: "421112582921",
    appId: "1:421112582921:web:95ab88030fec7ef07839d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  // Initialize Firebase first

// Now, Firebase services can be used
const auth = getAuth(app);   // Get Firebase Authentication instance
const database = getDatabase(app);  // Get Firebase Realtime Database instance

// Function to add a new transaction
function addTransaction() {
    const transactionName = document.getElementById('transaction-name').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionType = document.getElementById('transaction-type').value;

    if (transactionName && !isNaN(transactionAmount)) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                const transactionRef = ref(database, 'users/' + userId + '/transactions');

                const newTransactionRef = push(transactionRef);
                set(newTransactionRef, {
                    name: transactionName,
                    amount: transactionAmount,
                    type: transactionType,
                    date: new Date().toLocaleString() // Storing a readable date
                }).then(() => {
                    alert('Transaction added successfully!');
                    document.getElementById('transaction-name').value = '';
                    document.getElementById('transaction-amount').value = '';
                    loadTransactions(); // Refresh transactions after adding
                }).catch((error) => {
                    alert('Error adding transaction: ' + error.message);
                });
            } else {
                alert('No user is signed in.');
            }
        });
    } else {
        alert('Please enter valid transaction details.');
    }
}

// Function to load and display transactions for the logged-in user
function loadTransactions() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const transactionsRef = ref(database, 'users/' + userId + '/transactions');

            onValue(transactionsRef, (snapshot) => {
                const transactions = snapshot.val();
                const transactionList = document.getElementById('transaction-list');
                transactionList.innerHTML = ''; // Clear the list

                let totalIncome = 0;
                let totalExpenses = 0;

                if (transactions) {
                    for (let key in transactions) {
                        const transaction = transactions[key];
                        const li = document.createElement('li');
                        li.classList.add('transaction');
                        li.innerHTML = `
                            <span class="transaction-name">${transaction.name}</span>
                            <span class="transaction-amount">₹${transaction.amount.toFixed(2)}</span>
                            <span class="transaction-type">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                            <span class="transaction-date">${transaction.date}</span>
                        `;

                        transactionList.appendChild(li);

                        if (transaction.type === 'income') {
                            totalIncome += transaction.amount;
                        } else if (transaction.type === 'expense') {
                            totalExpenses += transaction.amount;
                        }
                    }
                } else {
                    transactionList.innerHTML = '<li>No transactions found.</li>';
                }

                // Update the summary
                document.getElementById('total-income').textContent = `Total Income: ₹${totalIncome.toFixed(2)}`;
                document.getElementById('total-expenses').textContent = `Total Expenses: ₹${totalExpenses.toFixed(2)}`;
                document.getElementById('net-balance').textContent = `Net Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}`;
            });
        } else {
            alert('No user is signed in.');
        }
    });
}

// Event listener for adding a transaction
document.getElementById('add-transaction').addEventListener('click', addTransaction);

// Load transactions when the page loads
document.addEventListener('DOMContentLoaded', loadTransactions);