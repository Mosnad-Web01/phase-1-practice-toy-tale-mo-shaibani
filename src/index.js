let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  // Toggle the visibility of the form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetchToys();

  // Handle form submission for adding a new toy
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addNewToy(event);
  });
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById('toy-collection');

  const toyCard = document.createElement('div');
  toyCard.className = 'card';

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Event listener for the like button
  toyCard.querySelector('.like-btn').addEventListener('click', () => {
    increaseLikes(toy);
  });

  toyCollection.appendChild(toyCard);
}

function addNewToy(event) {
  const toyData = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(toy => {
    renderToy(toy); // Add the new toy to the DOM
  });

  // Clear the form after submission
  event.target.reset();
}

// Function to increase likes for a toy
function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(toy.id).parentElement;
    toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
  });
}
