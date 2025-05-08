const rootUrl = "https://api.github.com/repos/CreepTV/ConflictStudios-Intern/contents/";
const token = "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"; // Read-only Token

document.addEventListener("DOMContentLoaded", async () => {
    const categories = {
        logos: "logos",
        banner: "banner",
        "grafik-elemente": "grafik-elemente",
        anderes: "anderes"
    };

    for (const [category, folder] of Object.entries(categories)) {
        const gallery = document.querySelector(`#${category} .gallery`);
        if (!gallery) continue;

        try {
            const response = await fetch(`${rootUrl}${folder}`, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            if (!response.ok) throw new Error(`Failed to fetch ${folder}`);

            const files = await response.json();
            files.forEach(file => {
                if (file.type === "file" && file.download_url) {
                    const img = document.createElement("img");
                    img.src = file.download_url;
                    img.alt = file.name;
                    gallery.appendChild(img);
                }
            });
        } catch (error) {
            console.error(`Error loading images for ${category}:`, error);
        }
    }
});

document.getElementById("search").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const images = document.querySelectorAll(".gallery img");

    images.forEach(img => {
        const matches = img.alt.toLowerCase().includes(searchTerm);
        img.style.display = matches ? "block" : "none";
    });
});

document.getElementById("category-filter").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    const sections = document.querySelectorAll("main section");

    sections.forEach(section => {
        if (selectedCategory === "all" || section.id === selectedCategory) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });
});

// Funktion: Bilder nach Namen sortieren
document.getElementById("category-filter").addEventListener("change", () => {
    const galleries = document.querySelectorAll(".gallery");
    galleries.forEach(gallery => {
        const images = Array.from(gallery.querySelectorAll("img"));
        images.sort((a, b) => a.alt.localeCompare(b.alt));
        images.forEach(img => gallery.appendChild(img));
    });
});

// Funktion: Alle Bilder einer Kategorie anzeigen
document.getElementById("category-filter").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory !== "all") {
        const gallery = document.querySelector(`#${selectedCategory} .gallery`);
        if (gallery) {
            const images = gallery.querySelectorAll("img");
            images.forEach(img => img.style.display = "block");
        }
    }
});

// Funktion: Vollansicht eines Bildes anzeigen
document.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG" && event.target.closest(".gallery")) {
        const imgSrc = event.target.src;
        const imgAlt = event.target.alt;

        // Vollansicht-Overlay erstellen
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";

        // Bild in der Vollansicht
        const fullImage = document.createElement("img");
        fullImage.src = imgSrc;
        fullImage.alt = imgAlt;

        // Zoom-Initialwerte
        let scale = 1;

        // Zoomfunktion mit Mausrad
        fullImage.addEventListener("wheel", (e) => {
            e.preventDefault();
            scale += e.deltaY * -0.001; // Zoomgeschwindigkeit
            scale = Math.min(Math.max(0.5, scale), 3); // Begrenzung des Zooms
            fullImage.style.transform = `scale(${scale})`;
        });

        // Werkzeugleiste erstellen
        const toolbar = document.createElement("div");
        toolbar.className = "toolbar";

        const downloadButton = document.createElement("a");
        downloadButton.className = "material-icons toolbar-button";
        downloadButton.textContent = "file_download";
        downloadButton.href = imgSrc;
        downloadButton.download = imgAlt;

        const shareButton = document.createElement("button");
        shareButton.className = "material-icons toolbar-button";
        shareButton.textContent = "share";
        shareButton.addEventListener("click", () => {
            navigator.clipboard.writeText(imgSrc);
            alert("Bildlink wurde kopiert!");
        });

        const closeButton = document.createElement("button");
        closeButton.className = "material-icons toolbar-button";
        closeButton.textContent = "close";
        closeButton.addEventListener("click", () => overlay.remove());

        // Buttons zur Werkzeugleiste hinzufügen
        toolbar.appendChild(downloadButton);
        toolbar.appendChild(shareButton);
        toolbar.appendChild(closeButton);

        // Elemente zum Overlay hinzufügen
        overlay.appendChild(toolbar);
        overlay.appendChild(fullImage);

        // Schließen bei Klick außerhalb des Bildes
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Overlay zum Dokument hinzufügen
        document.body.appendChild(overlay);
    }
});