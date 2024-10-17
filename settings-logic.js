// Select all the list items
const listItems = document.querySelectorAll('#settings-list li');
function handleSelection(item) {
  listItems.forEach(li => li.classList.remove('selected'));
  item.classList.add('selected');

  const selectedIndex = Array.from(listItems).indexOf(item);

  if (selectedIndex === 0) {
    document.getElementById("account_action").style.display = 'flex';
  } else if (selectedIndex === 1) {
    console.log("The second item is selected");
  }
}

// By default, select the first item when the page loads
window.onload = function() {
  handleSelection(listItems[0]);
};

// Add click event listener to each list item
listItems.forEach(item => {
  item.addEventListener('click', function() {
    handleSelection(this);
  });
});
