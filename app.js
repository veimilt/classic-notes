let notes = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("MyNotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

const main = document.querySelector("main");

function generateId() {
  return Date.now().toString();
}

function saveNotes() {
  localStorage.setItem("MyNotes", JSON.stringify(notes));
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  renderNotes();
}
function renderNotes() {
  if (notes.length === 0) {
    main.innerText = "No notes yet";
  } else {
    main.innerHTML = notes
      .map(
        (note) => `
      <article class="note-card">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">Edit</button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div>
      </article>
      `,
      )
      .join("");
  }
}

function saveNote(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (editingNoteId) {
    // update existing note
    const i = notes.findIndex((note) => note.id === editingNoteId);
    notes[i] = {
      ...notes[i],
      title,
      content,
    };
  } else {
    notes.unshift({
      id: generateId(),
      title,
      content,
    });
  }
  closeNoteDialog();
  saveNotes();
  renderNotes();
}

const noteDialog = document.getElementById("noteDialog");

function openNoteDialog(noteId = null) {
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    // edit existing note
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    // add new note
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }
  noteDialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  noteDialog.close();
}

function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme;

  let newTheme;

  if (currentTheme) {
    newTheme = currentTheme === "dark" ? "light" : "dark";
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    newTheme = prefersDark ? "light" : "dark";
  }

  document.documentElement.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("theme-toggle")
    .addEventListener("click", toggleTheme);
  notes = loadNotes();
  renderNotes();
  document.getElementById("noteForm").addEventListener("submit", saveNote);
});
