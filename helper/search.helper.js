let debounceTimerId;
document.getElementById('searchInput').addEventListener('input', function (event) {
    clearTimeout(debounceTimerId);
    debounceTimerId = setTimeout(async () => {
        const searchTerm = event.target.value.trim();
        if (searchTerm.length > 1) {
            await index.connectedDatabase.searchFoodItems(searchTerm);
        } else {
            document.getElementById('searchResults').innerHTML = '';
        }
    }, 400);
});

// async function index.connectedDatabase.searchFoodItems(searchTerm) {
//     try {
//         const response = await fetch(`http://your-api-url/search-food?term=${encodeURIComponent(searchTerm)}`);
//         if (!response.ok) throw new Error('Failed to fetch');
//         const items = await response.json();
//         displayResults(items);
//     } catch (error) {
//         console.error('Error fetching food items:', error);
//     }
// }

// function displayResults(items) {
//     const resultsContainer = document.getElementById('searchResults');
//     resultsContainer.innerHTML = '';
    
//     items.forEach(item => {
//         const resultItem = document.createElement('div');
//         resultItem.classList.add('result-item');
//         resultItem.textContent = item.foodName;
//         resultItem.onclick = function () { selectItem(item); };
//         resultsContainer.appendChild(resultItem);
//     });
// }

// function selectItem(item) {
//     console.log('Selected:', item);
//     // Implement additional logic to handle selected item
// }
