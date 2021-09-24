class Modal {

    constructor ({ modifier, title }) {
        this._modifier = modifier;
        this._title = title;
    }

    render (content) {
        const modal = document.querySelector(`.${this._modifier}`) ||
                      document.createElement("section");

        const prevFocusedElement = document.activeElement;
        prevFocusedElement.blur();

        if (!modal.className) {
            modal.className = "modal " + this._modifier;

            document.body.appendChild(modal);
        }

        document.body.classList.add("no-scroll");

        modal.innerHTML = `
            <div class="modal__wrapper">
                <button class="modal__close-btn"></button>
                <h3 class="modal__title">${this._title}</h3>
                <div class="modal__inner">${content}</div>
            </div>
        `;

        const closeBtn = modal.querySelector(".modal__close-btn");

        closeBtn.addEventListener("click", () => {
            prevFocusedElement.focus();

            this.close();
        });

        modal.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.close();

                prevFocusedElement.focus();
            }
        });

        const focusableElementsStr = `a[href], area[href], input:not([disabled]),
        select:not([disabled]), textarea:not([disabled]), button:not([disabled]),
        iframe, object, embed, [tabindex="0"], [contenteditable]`;

        const focusableElements = modal.querySelectorAll(focusableElementsStr);
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener("keydown", focusTrap);

        function focusTrap (event) {
            if (event.key != "Tab") return;

            if (event.shiftKey && document.activeElement === firstFocusableElement) {
                event.preventDefault();

                lastFocusableElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
                event.preventDefault();

                firstFocusableElement.focus();
            }
        }

        setTimeout(() => {
            modal.classList.add("modal--visible");
            firstFocusableElement.focus();
            modal.scrollTop = 0;
        });
    }

    close () {
        const modal = document.querySelector(`.${this._modifier}`);

        modal.classList.remove("modal--visible");

        document.body.classList.remove("no-scroll");
    }

}

export default Modal;