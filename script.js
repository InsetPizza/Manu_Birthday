/* ══════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════ */

function showScreen(id) {
    ["envelope-container","letter-container","menu-container",
     "camera-container","bouquet-container","letter2-container","ribbon-container"]
    .forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById(id);
    if (!target) return;
    target.style.display = "flex";

    // trigger open animation on inner window
    const win = target.querySelector(".letter-window, .menu-window, .gift-window");
    if (win) {
        win.classList.remove("open");
        void win.offsetWidth; // reflow
        setTimeout(() => win.classList.add("open"), 40);
    }
}

/* ══════════════════════════════════════════════════
   Screen 1 → 2: Envelope click
══════════════════════════════════════════════════ */
document.getElementById("envelope-container").addEventListener("click", () => {
    showScreen("letter-container");
    setTimeout(() => {
        document.querySelector(".letter-window").classList.add("open");
    }, 50);
});

/* ══════════════════════════════════════════════════
   Screen 2 — Yes / No buttons
══════════════════════════════════════════════════ */
const noBtn  = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");

let yesScale = 1;
yesBtn.style.position = "relative";
yesBtn.style.transformOrigin = "center center";
yesBtn.style.transition = "transform 0.3s ease";

noBtn.addEventListener("click", () => {
    yesScale += 2;
    if (yesBtn.style.position !== "fixed") {
        yesBtn.style.position = "fixed";
        yesBtn.style.top = "50%";
        yesBtn.style.left = "50%";
        yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    } else {
        yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
    }
});

yesBtn.addEventListener("click", () => {
    yesBtn.style.position = "relative";
    yesBtn.style.top = "";
    yesBtn.style.left = "";
    yesBtn.style.transform = "";

    const title = document.getElementById("letter-title");
    const catImg = document.getElementById("letter-cat");
    const buttons = document.getElementById("letter-buttons");

    title.textContent = "Yayyyy! Happy Birthday Manuu";
    catImg.src = "cat_dance.gif";
    document.querySelector(".letter-window").classList.add("final");
    buttons.style.display = "none";

    setTimeout(() => showScreen("menu-container"), 1800);
});

/* ══════════════════════════════════════════════════
   Screen 3 — Menu items
══════════════════════════════════════════════════ */
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
        const target = item.dataset.target;
        const screenMap = {
            camera:  "camera-container",
            bouquet: "bouquet-container",
            letter:  "letter2-container",
            ribbon:  "ribbon-container",
        };
        if (screenMap[target]) {
            if (target === "bouquet") initBouquet();
            showScreen(screenMap[target]);
        }
    });
});

/* ══════════════════════════════════════════════════
   Screen 3 — "End" button → final full-page photo
══════════════════════════════════════════════════ */
document.getElementById("end-btn").addEventListener("click", () => {
    showScreen("final-container");
});

/* ══════════════════════════════════════════════════
   Back buttons
══════════════════════════════════════════════════ */
document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const dest = btn.dataset.back;
        showScreen(dest === "menu" ? "menu-container" : "envelope-container");
    });
});

/* ══════════════════════════════════════════════════
   Camera — lightbox
══════════════════════════════════════════════════ */
document.querySelectorAll(".polaroid").forEach(card => {
    card.addEventListener("click", () => {
        const img = card.querySelector("img");
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const lb = document.getElementById("lightbox");
        document.getElementById("lightbox-img").src = img.src;
        lb.classList.add("open");
    });
});

document.querySelector(".lightbox-bg").addEventListener("click",  closeLightbox);
document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
}

/* ══════════════════════════════════════════════════
   Bouquet — animated flowers + reasons
══════════════════════════════════════════════════ */

let bouquetDone = false;

function initBouquet() {
    if (bouquetDone) return;
    bouquetDone = true;

    const garden = document.getElementById("flower-garden");

    FLOWERS.forEach((f, i) => {
        const div = document.createElement("div");
        div.className = "flower";
        div.textContent = f;
        div.style.animationDelay = `${i * 0.12}s`;
        garden.appendChild(div);
    });

    let html = "";
    REASONS.forEach((r, i) => {
        setTimeout(() => {
            html += (html ? " &nbsp;·&nbsp; " : "") + `<span>${r}</span>`;
            reasonsEl.innerHTML = html;
        }, 800 + i * 500);
    });
}
