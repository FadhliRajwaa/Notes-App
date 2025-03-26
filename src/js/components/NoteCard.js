export class NoteCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'body', 'date', 'archived', 'id'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || '';
        const body = this.getAttribute('body') || '';
        const date = new Date(this.getAttribute('date')).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const archived = this.getAttribute('archived') === 'true';
        const id = this.getAttribute('id') || '';

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: var(--card-bg);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                
                .card-title {
                    font-size: 1.25rem;
                    margin-bottom: 0.75rem;
                    color: var(--primary);
                    font-weight: 600;
                }
                
                .card-body {
                    color: #64748b;
                    margin-bottom: 1rem;
                    white-space: pre-line;
                    line-height: 1.6;
                }
                
                .card-date {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .card-date::before {
                    content: '📅';
                    font-size: 0.9em;
                }

                .card-actions {
                    margin-top: 1rem;
                    display: flex;
                    gap: 0.5rem;
                }

                .archive-btn {
                    background: ${archived ? '#10b981' : '#f59e0b'};
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background 0.3s ease;
                }

                .archive-btn:hover {
                    background: ${archived ? '#059669' : '#d97706'};
                }

                .delete-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background 0.3s ease;
                }

                .delete-btn:hover {
                    background: #dc2626;
                }
            </style>
            <div class="card">
                <div class="card-title">${title}</div>
                <div class="card-body">${body}</div>
                <div class="card-date">${date}</div>
                <div class="card-actions">
                    <button class="archive-btn">${archived ? 'Unarchive' : 'Archive'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
            const id = this.getAttribute('id');
            const archived = this.getAttribute('archived') === 'true';
            console.log('Tombol arsip diklik:', { id, archived: !archived }); // Debugging
            this.dispatchEvent(new CustomEvent('archive-toggled', {
                detail: { id, archived: !archived },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-note', {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('note-card', NoteCard);