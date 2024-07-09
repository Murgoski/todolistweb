/* ESSENTIAL FUNCTIONS */

function reverseDate(date) {
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function capitalizeFirstLetter(input) {
    let value = input.value;
    value = value.charAt(0).toUpperCase() + value.slice(1);
    input.value = value;
}

/* TASK ADD CODE */

// FUNCTION TO ADD A TASK
function addTask(taskName, startDate, dueDate, description, taskLabel) {
    const todoItem = document.createElement('div');

    // Map label names to their corresponding colors
    const labelColorMap = {
        'Personal': 'dark-gray',
        'Work': 'gray',
        'Home': 'blue',
        'Gym': '#6e3144',
        'School': 'magenta',
        'Faculty': 'green',
    };

    // Get the color class based on the taskLabel
    const labelColorClass = labelColorMap[taskLabel] || '';

    todoItem.innerHTML = `
        <button class="trash-button" title="Delete Task"><i class='bx bx-trash-alt bx-tada-hover'></i></button>
        <button class="clipboard-button" onclick = "openClipboardModal()" title="More Details"><i class='bx bx-clipboard bx-tada-hover'></i></button>
        <input type="checkbox" class="input_checkbox">
        <span class="taskName">${taskName}</span><br>
        <span class="Date__2"><strong>DUE TO: </strong>${dueDate ? reverseDate(dueDate) : '/'}</span>
        <span class="taskLabel" style = "color: ${labelColorClass}";>${taskLabel}</span>
    `;
    todoItem.classList.add('todoItem');
    document.getElementById('TaskContainer').appendChild(todoItem);

    // Code that puts line-trough if the checkbox is checked
    const checkbox = todoItem.querySelector('.input_checkbox');
    checkbox.addEventListener('change', function() {
        const taskNameElement = todoItem.querySelector('.taskName');
        const date2Element = todoItem.querySelector('.Date__2');

        if (checkbox.checked) {
            taskNameElement.style.textDecoration = 'line-through';
            date2Element.style.textDecoration = 'line-through';

            // Move the checked task to the bottom
            todoItem.parentNode.appendChild(todoItem);
        } else {
            taskNameElement.style.textDecoration = 'none';
            date2Element.style.textDecoration = 'none';

            // Move the unchecked task back to the top
            const firstItem = todoItem.parentNode.firstElementChild;
            todoItem.parentNode.insertBefore(todoItem, firstItem);
        }
    });

    // Code for taskItem Clipboard content
    const clipboardButton = todoItem.querySelector('.clipboard-button');
    clipboardButton.addEventListener('click', function() {
        document.getElementById('modaltodoName').textContent = taskName;
        document.getElementById('modalDate__1').textContent = startDate ? reverseDate(startDate) : '/';
        document.getElementById('modalDate__2').textContent = dueDate ? reverseDate(dueDate) : '/';
        document.getElementById('modal_description').textContent = description;
        document.getElementById('myModal').classList.add('show');
    });

    // Code for taskItem TrashButton - delete individual task
    const trashButton = todoItem.querySelector('.trash-button');
    trashButton.addEventListener('click', function() {
        
        /* todoItem.remove();
        // Remove the task from local storage
        removeTaskFromStorage(taskName); */

        /* const confirmDelete = confirm('Are you sure you want to delete the task?');

        if (confirmDelete) {
            todoItem.remove();
            // Remove the task from local storage
            removeTaskFromStorage(taskName);
        } */

        swal({
            title: "Delete current task?",
            text: "Once deleted, you will not be able to recover this task!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                todoItem.remove();
                removeTaskFromStorage(taskName);
                swal({
                    title: "Success!",
                    text: "Poof! Your task has been deleted!",
                    icon: "success",
                    buttons: false, // Skrije gumb za potrditev
                    timer: 2000,
                });
            }
        });

    });
    

    // FUNCTION TO REMOVE A TASK FROM LOCAL STORAGE
    function removeTaskFromStorage(taskName) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Find the index of the task to remove in the tasks array
        const index = tasks.findIndex(task => task.taskName === taskName);

        if (index !== -1) {
            // Remove the task from the array
            tasks.splice(index, 1);

            // Update the local storage with the modified tasks array
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // In the addTask function, set the data-task-label and data-task-name attributes
    todoItem.setAttribute('data-task-label', taskLabel);
    todoItem.setAttribute('data-task-name', taskName);

}

// FUNCTION TO SAVE TASKS TO LOCAL STORAGE
function saveTasksToStorage() {
    const tasks = Array.from(document.querySelectorAll('.todoItem')).map(todoItem => {
        const taskName = todoItem.querySelector('.taskName').textContent;
        const date2 = todoItem.querySelector('.Date__2').textContent.replace('DUE TO: ', '');
        const startDate = reverseDate(date2);
        const description = todoItem.querySelector('.description').textContent;
        return { taskName, startDate, description };
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// FUNCTION TO DISPLAY TASKS FROM LOCAL STORAGE
function displayTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.taskName, task.startDate, task.dueDate, task.description, task.taskLabel);
    });
}

// Add existing tasks from local storage when the page loads
window.addEventListener('load', function() {
    displayTasksFromStorage();
});


// Code to proceed the task 
document.getElementById('addTask').addEventListener('click', function() {
    // Get input values
    const taskName = document.getElementById('todoInput').value;
    const startDate = document.getElementById('Date__1').value;
    const dueDate = document.getElementById('Date__2').value;
    const description = document.getElementById('description').value;

    // Get the selected task label from the dropdown
    const taskLabelDropdown = document.getElementById('task_label');
    const taskLabel = taskLabelDropdown.options[taskLabelDropdown.selectedIndex].value;

    if (!taskName) {

        swal({
            title: "Error!",
            text: "Please enter all task details!",
            icon: "error",
            /* timer: 2000 // It does the same as setTimeout bellow */
        });

        return;
        
    }else{

        setTimeout(function () {
            swal({
                title: "Success!",
                text: "Task is added successfully!",
                icon: "success",
                buttons: false, // Hides the button to Confirm
            });
            
            setTimeout(function () {
                swal.close();
            }, 2000);
        }); 
        
    }

    // Create a task object
    const task = {
        taskName,
        startDate,
        dueDate,
        description,
        taskLabel,
    };

    // Save the task object to local storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(storedTasks));

    // Add the task to the list and clear input fields
    addTask(taskName, startDate, dueDate, description, taskLabel);
    document.getElementById('todoInput').value = '';
    document.getElementById('Date__1').value = '';
    document.getElementById('Date__2').value = '';
    document.getElementById('description').value = '';


    // Save all tasks to local storage
    saveTasksToStorage();
});

// Close the clipboard modal when the "Close" button is clicked
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('myModal').classList.remove('show');
});

/* DROPDOWN FROM CODE */

// FUNCTION THAT OPENS THE FORM DROPDOWN
function openFormDropdown() {
    var dropdownButton = document.querySelector('.FormDropbtn');
    var dropdownContent = document.getElementById("myDropdown");

    function toggleDropdown() {
        event.stopPropagation();
        dropdownContent.classList.toggle("show");
    }

    function closeDropdown() {
        dropdownContent.classList.remove('show');
    }

    dropdownButton.addEventListener("click", toggleDropdown);

    // Close the dropdown if the user clicks outside of it
    document.addEventListener("click", function(event) {
        if (!event.target.matches('.dropbtn') && !dropdownContent.contains(event.target)) {
            closeDropdown();
        }
    });

    // Add a task and close the dropdown when the "Add Task" button is clicked
    document.getElementById('addTask').addEventListener('click', function() {
        closeDropdown();
    });
}

// Call the function to initialize the dropdown behavior
openFormDropdown();

/* SEARCH TASKS CODE */

function toggleFilterDropdown() {
    const dropdownContainer = document.getElementById('dropdown-Search_container');
    dropdownContainer.classList.toggle('show');
}

function filterTasks() {
    var searchInput = document.getElementById('filter').value.trim().toLowerCase();
    var todoItems = document.getElementsByClassName('todoItem');
    var searchError = document.getElementById('searchError1');
    var matchingTasksFound = false;

    for (var i = 0; i < todoItems.length; i++) {
        var taskLabel = todoItems[i].getAttribute('data-task-label').toLowerCase();
        var taskName = todoItems[i].querySelector('.taskName').textContent.toLowerCase();
        var todoItem = todoItems[i];

        // Check if the search input matches task label or task name
        var matchesSearch = taskLabel.includes(searchInput) || taskName.includes(searchInput);

        // Determine if the task should be visible
        if (matchesSearch) {
            todoItem.style.display = 'block';
            matchingTasksFound = true;
        } else {
            todoItem.style.display = 'none';
        }
    }

    // Show or hide search error message based on matching tasks
    if (searchInput !== '' && !matchingTasksFound) {
        searchError.classList.add('showed');
    } else {
        searchError.classList.remove('showed');
    }
}

document.getElementById('filter').addEventListener('input', filterTasks);

filterTasks();


/* DELETE ALL TASKS */

function deleteAllTasks(){
    document.getElementById('deleteAllTasks').addEventListener('click', function() {

        swal({
            title: "Delete all tasks?",
            text: "Once deleted, you will not be able to recover the tasks!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                
                const taskContainer = document.getElementById('TaskContainer');
                while (taskContainer.firstChild) {
                    taskContainer.firstChild.remove();
                }
    
                // Clear tasks from local storage
                localStorage.removeItem('tasks');
            
                swal({
                    title: "Success!",
                    text: "All tasks have been deleted!",
                    icon: "success",
                    buttons: false, // Skrije gumb za potrditev
                    timer: 2000,
                });
            } 
        });
    
    });
}

deleteAllTasks()

/* CLIPBOARD MODAL CODE */

function openClipboardModal(){

    document.querySelector('.clipboard-button').addEventListener('click', function() {
        document.getElementById('modaltodoName').textContent = taskName;
        document.getElementById('modalDate__1').textContent = startDate ? reverseDate(startDate) : '/';
        document.getElementById('modalDate__2').textContent = dueDate ? reverseDate(dueDate) : '/';
        document.getElementById('modal_description').textContent = description;
        document.getElementById('myModal').classList.add('show');
    });
}


/* FORM MODAL POPUP */

document.addEventListener('DOMContentLoaded', function () {
    function formModalPopup() {
        document.getElementById('feedbackBtn').addEventListener('click', function() {
            document.getElementById('modal_form').style.display = 'block';
        });

        document.getElementsByClassName('close_form')[0].addEventListener('click', function() {
            document.getElementById('modal_form').style.display = 'none';
        });

        document.getElementById('feedbackForm').addEventListener('submit', function(event) {
            event.preventDefault();

            var senderName = document.querySelector("#contact-name").value;
            var senderEmail = document.querySelector("#contact-email").value;
            var message = document.querySelector("#contact-message").value;

            // Simple form validation
            if (!senderName || !senderEmail || !message) {
                swal({
                    title: "Error!",
                    text: "Please fill out all fields.",
                    icon: "error",
                    button: "OK",
                });
                return;
            }

            var params = {
                sendername: senderName,
                senderemail: senderEmail,
                message: message
            };

            var serviceID = "service_icoly7k";
            var templateID = "template_mqmoive";

            emailjs.send(serviceID, templateID, params)
            .then(res => {
                swal({
                    title: "Success!",
                    text: 'Thank you, ' + params['sendername'] + '! Your feedback has been sent!',
                    icon: "success",
                    button: "OK",
                    customClass: {
                        confirmButton: 'swal-button'
                    }
                });

                setTimeout(function() {
                    document.getElementById('feedbackForm').reset();
                    resetValidationStyles();
                }, 800); // Adjust the time as needed
            })
            .catch(error => {
                swal({
                    title: "Error!",
                    text: "Failed to send the message.",
                    icon: "error",
                    button: "OK",
                    customClass: {
                        confirmButton: 'swal-button'
                    }
                });
            });

            document.getElementById('modal_form').style.display = 'none';
        });
    }

    function resetValidationStyles() {
        var nameInput = document.getElementById('contact-name');
        var emailInput = document.getElementById('contact-email');
        
        // Reset input styles
        nameInput.style.borderBottomColor = "";
        emailInput.style.borderBottomColor = "";

        // Clear validation error messages
        document.getElementById('name-error').innerHTML = '';
        document.getElementById('email-error').innerHTML = '';
    }

    emailjs.init("sAmflmlG041uwz56O");

    formModalPopup();
});


/* FORM MODAL POPUP VALIDATIONS */

var nameError = document.getElementById('name-error');
var emailError = document.getElementById('email-error');

function validateName(){
    var nameInput = document.getElementById('contact-name');
    var name = nameInput.value;

    if(name.length == 0){
        nameError.innerHTML = 'Name is required!';
        nameInput.style.borderBottomColor = "red";
        return false;
    }

    if(!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)){
        nameError.innerHTML = 'Write full name!';
        nameInput.style.borderBottomColor = "red";
        return false;
    }
    nameError.innerHTML = '';
    nameInput.style.borderBottomColor = "green";
    return true;
}


function validateEmail(){
    var emailInput = document.getElementById('contact-email');
    var email = emailInput.value;

    if(email.length == 0){
        emailError.innerHTML = 'Email is required!';
        emailInput.style.borderBottomColor = "red";
        return false;
    }

    if(!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML = 'Email invalid';
        emailInput.style.borderBottomColor = "red";
        return false;
    }
    emailError.innerHTML = '';
    emailInput.style.borderBottomColor = "green";
    return true;
}

/* LOADING SCREEN */

document.addEventListener("DOMContentLoaded", function() {
    let progress = 1;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function updateProgress() {
        progressBar.style.width = progress + '%';
        progressText.innerText = progress + '%';

        if (progress < 100) {
            progress++;
            setTimeout(updateProgress, 10); // Adjust the speed of progress here
        } else {
            // Hide loading screen
            document.getElementById('loading-screen').style.display = 'none';
            // Show content
            document.querySelector('section.container').style.display = 'flex';
        }
    }

    updateProgress();
});


/* SCROLL REVEAL */

ScrollReveal({ 
    reset: true,
    distance: '80px',
    duration: 1000,
    delay: 1000

});

ScrollReveal().reveal('.header1 h2, .header h2, .additional-buttons', { origin: 'top' });
ScrollReveal().reveal('#TaskContainer, .todoItem', { origin: 'left' });
