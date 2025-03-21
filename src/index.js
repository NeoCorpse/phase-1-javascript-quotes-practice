'use strict';

const form = document.querySelector('form');
const quoteInput = document.querySelector('#new-quote');
const authorInput = document.querySelector('#author');
const quoteList = document.querySelector('#quote-list');

async function fetchFunc() {
    quoteList.innerHTML = ''
	fetch('http://localhost:3000/quotes?_embed=likes')
		.then((res) => res.json())
		.then((quotes) => {
            quotes.sort((a,b) => a.author.localeCompare(b.author))
			quotes.forEach((quote) => {
				const li = document.createElement('li');
				li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger' data-id="${quote.id}">Delete</button>
            </blockquote>
            `;
                const deleteBtn = li.querySelector('.btn-danger')
                const likeBtn = li.querySelector('.btn-success')

                deleteBtn.addEventListener('click', e => {
                    fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": 'application/json',
                            Accept: "application/json"
                        }
                    })
                    deleteBtn.parentElement.parentElement.remove()
                })

                likeBtn.addEventListener('click', e => {
                    let id = likeBtn.dataset.id
                    const time = new Date().getTime()
                    fetch(`http://localhost:3000/likes`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            Accept: "application/json"
                        },
                        body: JSON.stringify({
                            quoteId: +id,
                            createdAt: time,
                        })
                    })
				    const span = likeBtn.querySelector('span')
                    span.textContent=  +span.textContent + 1
                })
				quoteList.appendChild(li);
			});
			form.addEventListener('submit', (e) => {
				e.preventDefault();
                const id = quoteList.lastElementChild.querySelector('.btn-danger').dataset.id + 1
				fetch('http://localhost:3000/quotes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						id: `${id}`,
						quote: quoteInput.value,
						author: authorInput.value,
					}),
				});
				fetchFunc();
			});
		})
}

fetchFunc()
