// selectors
const todoInput = document.querySelector('.todo-input'); 
const todoButton = document.querySelector('.todo-button'); 
const todoList = document.querySelector('.todo-list'); 
const alarmSubmit = document.getElementById('alarmSubmit');
let alarmTimeout = null;

//event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
// added click event listener to the submit button 
alarmSubmit.addEventListener('click', setAlarm);

// audio used 
var audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
audio.loop = true;

// function to play the alarm ring tone
function ring(){
  audio.play();
}

// setAlarm will run whenever alarm is set from UI
function setAlarm(event){
	event.preventDefault();

	const alarm = document.getElementById('alarm');

	var alarmDate = new Date(alarm.value);
	
	var current = new Date();
	
	let timeToAlarm = alarmDate - current;

	if(timeToAlarm >= 0){

	alarmTimeout = setTimeout(() => {
			ring();
		}, timeToAlarm);

	}

	todoInput.value = "";
}

// displays the realtime clock on to the screen
function realTimeClock(){

	var rtClock = new Date();

	var hours = rtClock.getHours();
	var minutes = rtClock.getMinutes();
	var seconds = rtClock.getSeconds();
	var amPm;

	if(hours < 12){
		amPm = "AM";
	}
	else if(hours == 12){
		amPm = "PM";
	}
	else{
		hours = hours - 12;
		amPm = "PM";
	}

	if(hours == 0){
		hours = 12;
	}

	hours = ("0" + hours).slice(-2);
	minutes = ("0" + minutes).slice(-2);
	seconds = ("0" + seconds).slice(-2);

	document.getElementById('clock').innerHTML = hours + " : " + minutes + " : " + seconds + " " + amPm;

	setTimeout(realTimeClock, 1000);

}

// function to add a alarm to the list of alarms
function addTodo(event){
	event.preventDefault();

	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');

	const newTodo = document.createElement('li');
	newTodo.classList.add('todo-item');
	newTodo.innerText = todoInput.value;
	todoDiv.appendChild(newTodo);

	saveLocalTodos(todoInput.value);

	const completedButton = document.createElement('button');
	completedButton.innerHTML = '<i class="fas fa-check"></i>';
	completedButton.classList.add('complete-btn');
	todoDiv.appendChild(completedButton);

	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
	deleteButton.classList.add('delete-btn');
	todoDiv.appendChild(deleteButton);

	todoList.appendChild(todoDiv);

}

/* function which operates based on whether user clicked checked button(stops the alarm and throw alert to browser)
   or delete button(stops the alarm and delete that alarm)*/
function deleteCheck(event){

	const item = event.target;
	// if user clicked on delete button
	if(item.classList[0] === "delete-btn"){
		const todo = item.parentElement;
		todo.remove();
		removeLocalTodos(todo);
		audio.pause();
		if(alarmTimeout){
			clearTimeout(alarmTimeout);
		}
	}

	// if user cliked on checked button
	if(item.classList[0] === "complete-btn"){
		const todo = item.parentElement;
		todo.classList.toggle('completed');
		audio.pause();
		alert("Ringed");
	}

}

// function to save alarm to the local storage of browser
function saveLocalTodos(todo){
	let todos;

	if(localStorage.getItem("todos") === null){
		todos = [];
	}else{
		todos = JSON.parse(localStorage.getItem("todos"));
	}

	todos.push(todo);
	localStorage.setItem("todos", JSON.stringify(todos));
}

// function to remove a particular alarm from local storage 
function removeLocalTodos(todo){
	let todos;

	if(localStorage.getItem("todos") === null){
		todos = [];
	}else{
		todos = JSON.parse(localStorage.getItem("todos"));
	}

	const todoIndex = todos.indexOf(todo.children[0].innerText);
	todos.splice(todoIndex, 1);

	localStorage.setItem("todos", JSON.stringify(todos));
}

// function to get the list of alarms from local storage and running a loop to render those items to user
function getTodos(){
	let todos;

	if(localStorage.getItem("todos") === null){
		todos = [];
	}else{
		todos = JSON.parse(localStorage.getItem("todos"));
	}

	todos.forEach(function(todo){

	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');

	const newTodo = document.createElement('li');
	newTodo.classList.add('todo-item');
	newTodo.innerText = todo;
	todoDiv.appendChild(newTodo);

	const completedButton = document.createElement('button');
	completedButton.innerHTML = '<i class="fas fa-check"></i>';
	completedButton.classList.add('complete-btn');
	todoDiv.appendChild(completedButton);

	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
	deleteButton.classList.add('delete-btn');
	todoDiv.appendChild(deleteButton);

	todoList.appendChild(todoDiv);

	})
}
