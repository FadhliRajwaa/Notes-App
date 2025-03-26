import Swal from 'sweetalert2';

const loadingIndicator = document.createElement('loading-indicator');

function showLoading() {
    document.body.appendChild(loadingIndicator);
}

function hideLoading() {
    if (loadingIndicator.isConnected) document.body.removeChild(loadingIndicator);
}

export async function fetchNotes(callback, showArchived = false) {
    try {
        showLoading(); // Fungsi untuk menampilkan loading
        const endpoint = showArchived 
            ? 'https://notes-api.dicoding.dev/v2/notes/archived' 
            : 'https://notes-api.dicoding.dev/v2/notes';
        console.log('Mengambil data dari:', endpoint); // Debugging
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Gagal mengambil catatan');
        const data = await response.json();
        console.log('Data yang diambil:', data.data); // Debugging
        callback(data.data);
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
        });
    } finally {
        hideLoading(); // Sembunyikan loading
    }
}

export async function addNote(title, body) {
    try {
        showLoading();
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body })
        });
        if (!response.ok) throw new Error('Failed to add note');
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
        });
        throw error;
    } finally {
        hideLoading();
    }
}

export async function toggleArchive(id, shouldArchive) {
    try {
        showLoading();
        const endpoint = shouldArchive
            ? `https://notes-api.dicoding.dev/v2/notes/${id}/archive`
            : `https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`;
        console.log('Toggling archive:', { id, shouldArchive, endpoint });
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to ${shouldArchive ? 'archive' : 'unarchive'} note`);
        }
        const data = await response.json();
        console.log('Archive response:', data);
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
        });
        throw error;
    } finally {
        hideLoading();
    }
}

export async function deleteNote(id) {
    try {
        showLoading();
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete note');
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
        });
        throw error;
    } finally {
        hideLoading();
    }
}