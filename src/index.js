let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const getAllToys = () => {
    fetch('http://localhost:3000/toys')
      .then(resp => resp.json())
      .then(allToys => makeAllCards(allToys))
  }

  getAllToys()

  const toyCollection = document.querySelector('#toy-collection')
  function makeAllCards(allToys){
    for (let i = 0; i < allToys.length; i++) {
      const toy = allToys[i];
      makeSingleCard(toy)
    }
  }

  const toyForm = document.querySelector('.add-toy-form')
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let toyName = e.target.name.value
    let toyImage = e.target.image.value
    submitNewToy(toyName, toyImage)
    toyForm.reset()
  })

  function submitNewToy(name, image){
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0
      })
    })
    .then(resp => resp.json())
    .then(singleToy => makeSingleCard(singleToy))
  }

  function makeSingleCard(toy) {
    let newCard = document.createElement('div')
    newCard.className = 'card'
    newCard.dataset.toyId = toy.id
    newCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p data-like-count=${toy.likes}>${toy.likes} Likes </p>
    <button class="like-btn">Like <3</button>
    `
    toyCollection.appendChild(newCard)
  }

  toyCollection.addEventListener('click', (e) => {
    // e.preventDefault()
    if(e.target.className === 'like-btn'){
      const likeCount = e.target.parentNode.querySelector('p')
      const newLikeCount = parseInt(likeCount.dataset.likeCount) + 1
      likeCount.dataset.likeCount = newLikeCount
      likeCount.innerText = newLikeCount + " Likes"
      addLikeToToy(e.target.parentNode.dataset.toyId, newLikeCount)
    }
  })

  function addLikeToToy(toyId, toyLikes) {
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: toyLikes
      })
    })
  }


});