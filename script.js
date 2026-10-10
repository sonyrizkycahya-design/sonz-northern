// GANTI nomor di bawah dengan nomor WhatsApp kamu: kode negara Indonesia 62, tanpa tanda + atau angka 0 di depan.
const WHATSAPP_NUMBER = "6282260546200";
const WHATSAPP_MESSAGE = "Halo Sony, saya mengunjungi website SONZ NORTHERN.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.getElementById("heroWhatsapp").href = whatsappUrl;
document.getElementById("contactWhatsapp").href = whatsappUrl;
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

const fileInput = document.getElementById("fileInput");
const galleryGrid = document.getElementById("galleryGrid");
const emptyState = document.getElementById("emptyState");
const uploadStatus = document.getElementById("uploadStatus");
const filterButtons = [...document.querySelectorAll(".filter")];
let items = [];
let currentFilter = "all";

function prettySize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function renderGallery() {
  galleryGrid.querySelectorAll(".gallery-card").forEach(el => el.remove());
  const shown = items.filter(item => currentFilter === "all" || item.type === currentFilter);
  emptyState.hidden = shown.length > 0;
  document.getElementById("photoCount").textContent = items.filter(i => i.type === "image").length;
  document.getElementById("docCount").textContent = items.filter(i => i.type === "document").length;
  shown.forEach(item => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.url;
      img.alt = item.name;
      card.appendChild(img);
    } else {
      const preview = document.createElement("div");
      preview.className = "file-preview";
      preview.textContent = item.name.toLowerCase().endsWith(".pdf") ? "PDF" : "▤";
      card.appendChild(preview);
    }
    const info = document.createElement("div");
    info.className = "card-info";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const meta = document.createElement("small");
    meta.textContent = `${item.type === "image" ? "Gambar" : "Dokumen"} · ${prettySize(item.size)}`;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const download = document.createElement("a");
    download.className = "small-btn";
    download.href = item.url;
    download.download = item.name;
    download.textContent = "Unduh";
    const remove = document.createElement("button");
    remove.className = "small-btn";
    remove.textContent = "Hapus";
    remove.addEventListener("click", () => {
      URL.revokeObjectURL(item.url);
      items = items.filter(i => i.id !== item.id);
      renderGallery();
      uploadStatus.textContent = "File dihapus dari tampilan saat ini.";
    });
    actions.append(download, remove);
    info.append(name, meta, actions);
    card.appendChild(info);
    galleryGrid.appendChild(card);
  });
}
fileInput.addEventListener("change", event => {
  const selected = [...event.target.files];
  let added = 0;
  for (const file of selected) {
    const isImage = file.type.startsWith("image/");
    const allowed = isImage || /\.(pdf|doc|docx|xls|xlsx|txt)$/i.test(file.name);
    if (!allowed) continue;
    if (file.size > 15 * 1024 * 1024) {
      uploadStatus.textContent = `File ${file.name} lebih dari 15 MB dan dilewati.`;
      continue;
    }
    items.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name, size: file.size, type: isImage ? "image" : "document",
      url: URL.createObjectURL(file)
    });
    added++;
  }
  uploadStatus.textContent = added ? `${added} file ditambahkan. File hanya tersedia di sesi browser ini.` : (selected.length ? "Tidak ada file yang cocok. Coba format yang didukung." : "");
  renderGallery();
  fileInput.value = "";
});
filterButtons.forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter;
  filterButtons.forEach(b => b.classList.toggle("active", b === button));
  renderGallery();
}));
window.addEventListener("beforeunload", () => items.forEach(item => URL.revokeObjectURL(item.url)));
renderGallery();
