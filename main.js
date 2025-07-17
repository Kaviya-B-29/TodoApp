let entries = JSON.parse(localStorage.getItem("entries")) || [];

const form = document.getElementById("entry-form");
const list = document.getElementById("entry-list");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const resetBtn = document.getElementById("reset-btn");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");

// Add or Update Entry
form.onsubmit = (e) => {
  e.preventDefault();
  const newEntry = {
    id: Date.now(),
    description: description.value,
    amount: +amount.value,
    type: type.value,
  };
  entries.push(newEntry);
  updateLocalStorage();
  render();
  form.reset();
};

// Reset Button
resetBtn.onclick = () => form.reset();

// Render Entries
function render(filter = "all") {
  list.innerHTML = "";
  const filtered = entries.filter((e) => filter === "all" || e.type === filter);
  let income = 0,
    expense = 0;

  filtered.forEach((entry) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-100 p-3 rounded-md shadow";
    li.innerHTML = `
      <div>
        <p class="font-medium">${entry.description}</p>
        <p class="text-sm text-gray-600">₹${entry.amount} - ${entry.type}</p>
      </div>
      <div class="space-x-2">
        <button onclick="editEntry(${entry.id})" class="text-blue-600 hover:underline">Edit</button>
        <button onclick="deleteEntry(${entry.id})" class="text-red-600 hover:underline">Delete</button>
      </div>
    `;
    list.appendChild(li);

    if (entry.type === "income") income += entry.amount;
    else expense += entry.amount;
  });

  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  netBalance.textContent = income - expense;
}

// Edit
window.editEntry = (id) => {
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    description.value = entry.description;
    amount.value = entry.amount;
    type.value = entry.type;
    entries = entries.filter((e) => e.id !== id);
    updateLocalStorage();
    render();
  }
};

// Delete
window.deleteEntry = (id) => {
  entries = entries.filter((e) => e.id !== id);
  updateLocalStorage();
  render();
};

// Filter
document.querySelectorAll('input[name="filter"]').forEach((radio) =>
  radio.addEventListener("change", (e) => render(e.target.value))
);

function updateLocalStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

render();
