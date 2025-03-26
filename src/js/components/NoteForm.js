export class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    background: var(--card-bg);
                    padding: 30px;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                label {
                    font-weight: 500;
                    color: var(--text);
                    display: block;
                    margin-bottom: 0.5rem;
                }
                
                input, textarea {
                    width: 80%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: white;
                }
                
                input:focus, textarea:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    outline: none;
                }
                
                button {
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: transform 0.2s, box-shadow 0.2s;
                    width: 100%;
                }
                
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
                }
                
                .error {
                    border-color: #ef4444 !important;
                }
                
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: none;
                }
            </style>
            <form id="noteForm">
                <div class="form-group">
                    <label>Note Title</label>
                    <input type="text" id="title" placeholder="Enter note title" required>
                    <div class="error-message" id="titleError">Title is required</div>
                </div>
                <div class="form-group">
                    <label>Note Content</label>
                    <textarea id="body" rows="5" placeholder="Write your note here..." required></textarea>
                    <div class="error-message" id="bodyError">Content is required</div>
                </div>
                <button type="submit">Add New Note</button>
            </form>
        `;

        this.setupValidation();
    }

    setupValidation() {
        const form = this.shadowRoot.getElementById('noteForm');
        const titleInput = this.shadowRoot.getElementById('title');
        const bodyInput = this.shadowRoot.getElementById('body');
        const titleError = this.shadowRoot.getElementById('titleError');
        const bodyError = this.shadowRoot.getElementById('bodyError');

        const validateInput = (input, errorElement) => {
            const isValid = input.value.trim().length > 0;
            input.classList.toggle('error', !isValid);
            errorElement.style.display = !isValid ? 'block' : 'none';
            return isValid;
        };

        titleInput.addEventListener('input', () => validateInput(titleInput, titleError));
        bodyInput.addEventListener('input', () => validateInput(bodyInput, bodyError));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const isTitleValid = validateInput(titleInput, titleError);
            const isBodyValid = validateInput(bodyInput, bodyError);

            if (isTitleValid && isBodyValid) {
                this.dispatchEvent(new CustomEvent('note-added', {
                    detail: {
                        title: titleInput.value,
                        body: bodyInput.value
                    },
                    bubbles: true,
                    composed: true
                }));
                form.reset();
            }
        });
    }
}

customElements.define('note-form', NoteForm);