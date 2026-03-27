document.addEventListener("DOMContentLoaded", () => {
    const timestamp = document.querySelector("#timestamp");
    if (timestamp) {
        timestamp.value = new Date().toLocaleString();
    }

    const backdrop = document.getElementById("modalBackdrop");
    const openButtons = document.querySelectorAll("[data-modal]");
    const closeButtons = document.querySelectorAll(".modal-close");
    const modals = document.querySelectorAll(".membership-modal");

    const toggleModal = (modal, show) => {
        if (!modal) {
            return;
        }
        modal.classList.toggle("active", show);
        modal.setAttribute("aria-hidden", show ? "false" : "true");
        if (backdrop) {
            backdrop.classList.toggle("active", show);
        }
        if (show) {
            const focusable = modal.querySelector("button, [href], input, select, textarea");
            if (focusable) {
                focusable.focus();
            }
        }
    };

    openButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const modalId = button.dataset.modal;
            const modal = document.getElementById(`modal-${modalId}`);
            toggleModal(modal, true);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".membership-modal");
            toggleModal(modal, false);
        });
    });

    backdrop?.addEventListener("click", () => {
        modals.forEach((modal) => toggleModal(modal, false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modals.forEach((modal) => {
                if (modal.classList.contains("active")) {
                    toggleModal(modal, false);
                }
            });
        }
    });
});
