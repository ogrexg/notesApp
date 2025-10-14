const createNote = document.getElementById('createNote');
const notesNull = document.getElementById('notesNull'); 
const notesBlock = document.getElementById('notesBlock');
const notesList = document.getElementById('notesList');
const filterInput = document.getElementById('myInput');
let isNoteOpen = false;
let currentEditingNote = null;
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let noteName, noteText;
const auth = document.getElementById('auth');
const authBtn = document.getElementById('authBtn');
const authSend = document.getElementById('authSend');
const username = document.getElementById('username');
const password = document.getElementById('password');



const url = "http://0.0.0.0:8000/v1/auth/login";

async function authSendFunc() {
    const body = new URLSearchParams({
    username: username.value,
    password: password.value
    });

    try {
        const response = await fetch(url, {
            method: "POST", // или 'PUT'
            body: body, // данные могут быть 'строкой' или {объектом}!
            headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            },
        });
        const json = await response.json();

        if (response.status == 200) {
            localStorage.setItem('user', JSON.stringify(json));
            console.log(localStorage.getItem('user')); // <-- ключ 'user'
        }
        
        console.log(response);

    } catch (error) {
        console.error("Ошибка:", error);
    }
}

function toggleAuthModal() {
    if (auth.style.visibility === 'visible') {
        auth.style.visibility = 'hidden';
    } else {
        auth.style.visibility = 'visible';
    }
}

function initializeNoteInputs() {
    const noteInputContainer = document.createElement('div');
    noteInputContainer.className = 'noteHeaderSt';

    noteName = document.createElement('input');
    noteName.className = 'input';
    noteName.id = 'noteName';
    noteName.placeholder = 'Введите название заметки';

    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeNoteBlock);

    noteInputContainer.appendChild(noteName);
    noteInputContainer.appendChild(closeButton);

    notesBlock.appendChild(noteInputContainer);

    noteText = document.createElement('textarea');
    noteText.className = 'textarea';
    noteText.id = 'noteText';
    noteText.placeholder = 'Место для записи';

    notesBlock.appendChild(noteText);

    noteName.addEventListener('input', handleNoteInput);
    noteText.addEventListener('input', handleNoteTextInput);
}

function displayNotes(filter = '') {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        if (note.title.toLowerCase().includes(filter.toLowerCase())) {
            const listDiv = document.createElement('div');
            listDiv.className = 'listDiv';

            const list = document.createElement('li');
            list.textContent = note.title;
            list.setAttribute('info', note.text);
            list.setAttribute('data-index', index);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('x', '0px');
            svg.setAttribute('y', '0px');
            svg.setAttribute('width', '50');
            svg.setAttribute('height', '50');
            svg.setAttribute('viewBox', '0 0 50 50');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z');

            svg.appendChild(path);
            deleteButton.appendChild(svg);

            deleteButton.addEventListener('click', function() {
                console.log('Кнопка удаления нажата');
            });          
            
            deleteButton.addEventListener('click', function() {
                deleteNote(index);
            });

            list.addEventListener('click', function() {
                openNoteForEditing(note, list);
            });

            listDiv.appendChild(list);
            listDiv.appendChild(deleteButton);
            notesList.appendChild(listDiv);
        }
    });

    const hasNotes = notes.length > 0;
    notesList.style.display = hasNotes ? 'block' : 'none';
    notesNull.style.display = hasNotes ? 'none' : 'block';
    filterInput.style.display = hasNotes ? 'block' : 'none';
}

function openNoteForEditing(note, list) {
    noteName.value = note.title;
    noteText.value = note.text;
    notesBlock.style.display = 'flex';
    currentEditingNote = list;
    isNoteOpen = true;
}

function createNewNote() {
    currentEditingNote = null;
    notesBlock.style.display = 'flex';
    noteName.value = '';
    noteText.value = '';
    isNoteOpen = true;
}

function handleNoteInput() {
    const noteTitle = noteName.value.trim();
    const noteTextValue = noteText.value.trim();

    if (currentEditingNote) {
        const index = currentEditingNote.getAttribute('data-index');
        notes[index].title = noteTitle;
        notes[index].text = noteTextValue;
        localStorage.setItem('notes', JSON.stringify(notes));
        currentEditingNote.textContent = noteTitle;
    } else if (noteTitle !== '') {
        const newNote = {
            title: noteTitle,
            text: noteTextValue
        };
        notes.push(newNote);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();

        const index = notes.length - 1;
        currentEditingNote = notesList.children[index].querySelector('li');
        notesBlock.style.display = 'flex';
        isNoteOpen = true;
    }
}

function handleNoteTextInput() {
    if (currentEditingNote) {
        const index = currentEditingNote.getAttribute('data-index');
        notes[index].text = noteText.value;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function closeNoteBlock() {
    notesBlock.style.display = 'none';
    isNoteOpen = false;
    currentEditingNote = null;
}

function deleteNote(index) {
    if (currentEditingNote && currentEditingNote.getAttribute('data-index') === index.toString()) {
        closeNoteBlock()
    }
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();

}

document.addEventListener('DOMContentLoaded', function() {
    initializeNoteInputs();
    displayNotes();

    authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAuthModal();
    });

    document.addEventListener('click', (e) => {
        if (e.target !== auth && !auth.contains(e.target) && e.target !== authBtn) {
            auth.style.visibility = 'hidden';
        }
    });

    authSend.addEventListener('click', authSendFunc);


    createNote.addEventListener('click', createNewNote);

    filterInput.addEventListener('input', function() {
        const filterValue = filterInput.value;
        displayNotes(filterValue);
    });
});