import '../css/style.css';
import './components/AppBar.js';
import './components/NoteForm.js';
import './components/NoteCard.js';
import './components/LoadingIndicator.js';
import { fetchNotes, addNote, toggleArchive, deleteNote } from './api/notesApi.js';
import { gsap } from 'gsap';

// Variabel global untuk melacak tab yang aktif
let showArchived = false;

// Fungsi untuk merender daftar catatan
function renderNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    // Filter catatan berdasarkan tab aktif
    const filteredNotes = notes.filter(note => showArchived ? note.archived : !note.archived);

    filteredNotes.forEach((note, index) => {
        const card = document.createElement('note-card');
        card.setAttribute('title', note.title);
        card.setAttribute('body', note.body);
        card.setAttribute('date', note.createdAt);
        card.setAttribute('archived', note.archived.toString());
        card.setAttribute('id', note.id);
        notesContainer.appendChild(card);

        // Animasi saat card muncul
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.out'
        });

        // Event untuk arsip/unarsip
        card.addEventListener('archive-toggled', async (e) => {
            const { id, archived } = e.detail;
            if (id) {
                gsap.to(card, {
                    opacity: 0,
                    y: -50,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: async () => {
                        await toggleArchive(id, archived);
                        await fetchNotes(renderNotes, showArchived);
                    }
                });
            }
        });

        // Event untuk hapus
        card.addEventListener('delete-note', async (e) => {
            const { id } = e.detail;
            if (id) {
                gsap.to(card, {
                    opacity: 0,
                    y: -50,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: async () => {
                        await deleteNote(id);
                        await fetchNotes(renderNotes, showArchived);
                    }
                });
            }
        });
    });
}

// Event listener untuk menambahkan catatan baru
document.querySelector('note-form').addEventListener('note-added', async (e) => {
    await addNote(e.detail.title, e.detail.body);
    await fetchNotes(renderNotes, showArchived);
});

// Setup tab untuk Active Notes dan Archived Notes
const appBar = document.querySelector('app-bar');
const activeNotesBtn = appBar.shadowRoot.querySelector('#activeNotesBtn');
const archivedNotesBtn = appBar.shadowRoot.querySelector('#archivedNotesBtn');

// Event listener untuk beralih ke tab Active Notes
activeNotesBtn.addEventListener('click', () => {
    showArchived = false;
    activeNotesBtn.classList.add('active');
    archivedNotesBtn.classList.remove('active');
    gsap.to('#notesContainer', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            fetchNotes(renderNotes, showArchived);
            gsap.to('#notesContainer', { opacity: 1, duration: 0.3 });
        }
    });
});

// Event listener untuk beralih ke tab Archived Notes
archivedNotesBtn.addEventListener('click', () => {
    showArchived = true;
    archivedNotesBtn.classList.add('active');
    activeNotesBtn.classList.remove('active');
    gsap.to('#notesContainer', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            fetchNotes(renderNotes, showArchived);
            gsap.to('#notesContainer', { opacity: 1, duration: 0.3 });
        }
    });
});

// Set tab default ke Active Notes
activeNotesBtn.classList.add('active');
fetchNotes(renderNotes, showArchived);