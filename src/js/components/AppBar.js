export class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Modern Notes';
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-size: 1.75rem;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                    backdrop-filter: blur(10px);
                }

                .tab-container {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .tab-container button {
                    background: linear-gradient(135deg, #e2e8f0, #d1d9e6); /* Gradasi abu-abu lembut */
                    color: #1e293b;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 2rem;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 500;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .tab-container button:hover {
                    background: linear-gradient(135deg, #6366f1, #3b82f6);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .tab-container button.active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
                    transform: translateY(-2px);
                }

                .tab-container button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transition: 0.5s;
                }

                .tab-container button:hover::before {
                    left: 100%;
                }
            </style>
            <header>${title}</header>
            <div class="tab-container">
                <button id="activeNotesBtn">Active Notes</button>
                <button id="archivedNotesBtn">Archived Notes</button>
            </div>
        `;
    }
}

customElements.define('app-bar', AppBar);