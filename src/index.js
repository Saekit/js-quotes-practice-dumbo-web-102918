document.addEventListener("DOMContentLoaded", function(){
fetchQuote()
addNewQuote()
addDeleteBtn()
incLikes()
populateEditQuoteForm()
editQuoteForm()
})

function fetchQuote(){

  fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(data => {
      data.forEach(function(quote){
      showQuote(quote.id, quote.quote, quote.author, quote.likes)

      })
    })
}

function showQuote(id, quote, author, likes){
  let ul = document.querySelector("#quote-list")
  let li = document.createElement("li")

  li.innerHTML =
  `<li data-id="${id}" class='quote-card' >
    <blockquote class="blockquote">
      <p data-id="${id}" class="mb-0 quote-p">${quote}</p>
      <footer class="blockquote-footer author-name">${author}</footer>
      <br>
      <button data-id="${id}" class='btn-success'>Likes: <span class="like-amount">${likes}</span></button>
      <button data-id="${id}" class='edit-btn'>Edit</button>
      <button data-id="${id}" class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
      ul.append(li)
}

function addNewQuote(){
  let ul = document.querySelector("#quote-list")
  let quoteForm = document.querySelector("#new-quote-form")
  quoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    let newQuoteInput = document.querySelector("#new-quote")
    let newAuthorInput = document.querySelector("#author")
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "quote": newQuoteInput.value,
        "author": newAuthorInput.value,
        "likes": 0
      })
    }).then(res => res.json())
      .then(quote => {
        showQuote(quote.id, quote.quote, quote.author, quote.likes)})
        quoteForm.reset()
  })
}

function addDeleteBtn(){
  let ul = document.querySelector("#quote-list")

  ul.addEventListener("click", function(e){
    if (e.target.classList.contains("btn-danger")){
      let quoteId = e.target.dataset.id
      return fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE",
      }).then(res => {
        e.target.parentNode.parentNode.parentNode.remove()
      })
    }
  })
}

function incLikes(){
  let ul = document.querySelector("#quote-list")

  ul.addEventListener("click", function(e){
    if (e.target.classList.contains('btn-success')){
      let quoteId = e.target.dataset.id
      let likeAmount = e.target.querySelector(".like-amount").innerText

      return fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Access: "application/json"
        },
        body: JSON.stringify({
          "likes": ++likeAmount
        })
      }).then(res => {
        if (res.ok) {
          e.target.querySelector('.like-amount').innerText = likeAmount
        }
      })
    }
  })
}
function populateEditQuoteForm(){
  let ul = document.querySelector("#quote-list")

  ul.addEventListener("click", function(e){
    if (e.target.classList.contains("edit-btn")){
      let editButton = e.target
      let parent = editButton.parentNode
      let quoteInput = document.querySelector("#edit-quote")
      let authorInput = document.querySelector("#edit-author")
      let quote = parent.querySelector("p").innerText
      let author = parent.querySelector(".author-name").innerText
      quoteInput.value = quote
      authorInput.value = author

      let quoteId = document.getElementById("quote-id")
      let id = editButton.dataset.id
      quoteId.value = id

    }
  })
}

function editQuoteForm(){
  let quoteInput = document.querySelector("#edit-quote")
  let authorInput = document.querySelector("#edit-author")
  let editForm = document.querySelector("#edit-quote-form")
  editForm.addEventListener("submit", function(e){
    e.preventDefault()
    let quoteId = document.getElementById("quote-id")

    fetch(`http://localhost:3000/quotes/${quoteId.value}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Access: "application/json"
      },
      body: JSON.stringify({
        "quote": quoteInput.value,
        "author": authorInput.value
      })
    }).then(res => {
      let quoteLi = document.querySelector(`[data-id="${quoteId.value}"]`)

      quoteLi.querySelector(".quote-p").innerText = quoteInput.value
      quoteLi.querySelector(".author-name").innerText = authorInput.value
      editForm.reset()
    })
  })
}
