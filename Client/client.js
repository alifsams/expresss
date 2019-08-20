console.log("Hello World!");

const form = document.querySelector('form'); //grabbing an element on the page
const loadingElement = document.querySelector('.loading');
const expsElement = document.querySelector('.exps');
const API_URL = 'http://localhost:5000/exps';

loadingElement.style.display = '';

listAllExps();

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');
	
	const exp = {
		name,
		content
	};
	
	form.style.display = 'none';
	loadingElement.style.display = '';
	
	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(exp),
		headers: {
			'content-type': 'application/json'
		}	
	}).then(response => response.json())
	.then(createdExp => {
		form.reset();
		setTimeout(() => {
			form.style.display = '';
		}, 30000);
		listAllExps();
	});
	
});

function listAllExps() {
	expsElement.innerHTML = '';
	fetch(API_URL)
		.then(response => response.json())
		.then(exps => {
			console.log(exps);
			exps.reverse();
			exps.forEach(exp => {
				const div = document.createElement('div');
			
				const header = document.createElement('h3');
				header.textContent = exp.name;

				const contents = document.createElement('p');
				contents.textContent = exp.content;
				
				const date = document.createElement('small');
				date.textContent = new Date(exp.created);

				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);

				expsElement.appendChild(div);
				
			});
		loadingElement.style.display = 'none';
		});
	
}