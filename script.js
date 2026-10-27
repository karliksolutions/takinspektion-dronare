/* =========================================================
   Karlik Solutions – gemensamt script för alla sidor
   ========================================================= */

/* ---------- Mobilmeny ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#huvudmeny");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Öppna meny" : "Stäng meny");
        navMenu.classList.toggle("open", !isOpen);
    });

    // Stäng menyn när man klickar på en länk
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Öppna meny");
            navMenu.classList.remove("open");
        });
    });
}

/* ---------- Klickbara exempel (Digitala lösningar) ---------- */
const exampleCards = document.querySelectorAll(".example-card");
const examplePanels = document.querySelectorAll(".example-panel");

if (exampleCards.length && examplePanels.length) {
    const showExample = (id, scroll) => {
        const panel = document.querySelector("#panel-" + id);
        if (!panel) return false;

        examplePanels.forEach((p) => { p.hidden = p !== panel; });
        exampleCards.forEach((card) => {
            const active = card.dataset.example === id;
            card.classList.toggle("is-active", active);
            card.setAttribute("aria-pressed", String(active));
        });

        if (scroll) {
            document.querySelector("#exempel").scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", "#" + id);
        }
        return true;
    };

    exampleCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            showExample(card.dataset.example, true);
        });
    });

    // Startläge: Hyllsök, eller det exempel som anges i adressen (t.ex. #hemsidor)
    const fromHash = location.hash.replace("#", "");
    if (!showExample(fromHash, false)) {
        showExample("hyllsok", false);
    }
}

/* ---------- Kontaktformulär ---------- */
const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");

if (form && statusEl) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Honeypot: om fältet är ifyllt är det en bot – låtsas att allt gick bra men skicka inget
        const honeypot = form.querySelector("#website");
        if (honeypot && honeypot.value.trim() !== "") {
            form.reset();
            statusEl.textContent = "Tack! Vi återkommer så snart vi kan.";
            statusEl.className = "form-status success";
            return;
        }

        statusEl.textContent = "Skickar...";
        statusEl.className = "form-status";

        const submitButton = form.querySelector("button[type='submit']");
        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form)
            });

            if (response.ok) {
                form.reset();
                statusEl.textContent = "Tack! Vi återkommer så snart vi kan.";
                statusEl.classList.add("success");
            } else {
                throw new Error("Bad response");
            }
        } catch (error) {
            statusEl.textContent = "Något gick fel. Försök igen eller ring oss.";
            statusEl.classList.add("error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}
