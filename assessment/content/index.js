apiFetch('/api/list', response => {
    if (response.status === 'success') {
        const notes = response.notes;
        const output = document.getElementById('notes');
        output.innerHTML = '';
        if (notes.length > 0) {
            for (let note of notes) {
                addNote(note);
            }
        } else {
            output.innerHTML = `
                    <h2>No notes yet!</h2>
                    <p>Create one by clicking the button below!</p>
                `;
        }
    } else {
        window.location = '/login.html';
    }
});

function updateNote(note) {
    const noteDiv = document.getElementById(`note${note.id}`);
    noteDiv.innerHTML = `
                        <h2 id="title-${note.id}">${htmlEscape(note.title)}</h2>
                        <a href="data:text/plain;charset=utf-8,${htmlEscape(note.content)}" download="${htmlEscape(note.title)}.txt">Download</a>
                        <p>${htmlEscape(note.content.substring(0, 100))}</p>
                        <button onclick="editNote('${noteDiv.id}', '${note.id}')">Edit</button>
                        <button onclick="deleteNote('${note.id}')">Delete</button>
                    `;
}

let notes = [];

function addNote(note) {
    const output = document.getElementById('notes');
    if (notes.length === 0) {
        output.innerHTML = '';
    }
    notes.push(note);
    let noteDiv = document.createElement('div');
    noteDiv.id = 'note' + note.id;
    output.appendChild(noteDiv);
    updateNote(note);
}

function handleCreate(event) {
    event.preventDefault();
    const title = document.getElementById('titleBox').value;
    document.getElementById('create-form').reset();
    apiFetch('/api/create', response => {
        const id = response.id;
        addNote({
            id: id,
            title: title,
            content: ''
        });
        editNote(`note${id}`, id);
    }, {
        method: 'POST',
        body: `title=${encodeURIComponent(title)}`
    });
}

function deleteNote(id) {
    apiFetch(`/api/delete?id=${id}`, response => {
        if (response.status === 'success') {
            document.location.reload();
        } else {
            window.location = '/login.html';
        }
    });
}

function editNote(parentElementId, noteId) {
    if (document.getElementById(`edit-${noteId}`) === null) {
        const parentElement = document.getElementById(parentElementId);
        const element = document.createElement('div');
        parentElement.appendChild(element);
        apiFetch(`/api/get?id=${noteId}`, response => {
            if (response.status === 'success') {
                const note = response.note;
                element.id = `edit-${noteId}`;
                element.innerHTML = `
                        <input type="text" id="edit-title-${note.id}" value="${htmlEscape(note.title)}" required />
                        <br/>
                        <textarea id="edit-content-${note.id}">${htmlEscape(note.content)}</textarea>
                        <button onclick="closeEdit('${note.id}')">Done</button>
                `;
                // Set up autosave for the title and content.
                initAutosave(note.id);
                const textbox = element.querySelector('textarea');
                // Put focus on the text box so they can start typing.
                textbox.focus();
            } else {
                window.location = '/login.html';
            }
        });
    }
}

function initAutosave(id) {
    const titleBox = document.getElementById(`edit-title-${id}`);
    const contentBox = document.getElementById(`edit-content-${id}`);
    const saveHandler = () => {
        if (titleBox.value !== '') {
            apiFetch('/api/update', response => {
                if (response.status === "access denied") {
                    window.location = '/login.html';
                }
                // Update the in-memory note.
                const note = notes.find(note => note.id === id);
                note.title = titleBox.value;
                note.content = contentBox.value;
            }, {
                method: "POST",
                Headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${encodeURIComponent(id)}&title=${encodeURIComponent(titleBox.value)}&content=${encodeURIComponent(contentBox.value)}`
            });
        }
    };
    const saveThrottle = throttle(1000, saveHandler);
    titleBox.addEventListener('input', () => saveThrottle());
    contentBox.addEventListener('input', () => saveThrottle());
}

function closeEdit(id) {
    const titleBox = document.getElementById(`edit-title-${id}`);
    const title = titleBox.value;
    document.getElementById(`edit-${id}`).remove();
    if (title.length > 0) {
        document.getElementById(`title-${id}`).innerHTML = title;
    }
    // Update the download link and the sample note contents.
    updateNote(notes.find(note => note.id === id));
}
