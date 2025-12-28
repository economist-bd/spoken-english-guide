// ===================================================
// গিটহাব কনফিগারেশন (পরিবর্তন করুন)
// ===================================================
const GITHUB_USERNAME = 'economist-bd'; 
const GITHUB_REPO = 'English-Grammar-Masterclass'; // নতুন রিপো নাম দিন
const GITHUB_BRANCH = 'main';       
const IMAGE_FOLDER = 'images';      
const IMAGE_EXTENSION = '.jpg';     
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    const chapterList = document.getElementById('chapter-list');
    const bookContent = document.getElementById('book-content');
    const landingPage = document.getElementById('landing-page');
    const readerPage = document.getElementById('reader-page');
    const sidebar = document.getElementById('sidebar');

    const githubBaseUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${IMAGE_FOLDER}/`;

    // 1. Load Chapters
    function loadChapters() {
        if (!chapterList) return;
        bookData.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-book-open"></i> ${chapter.title}`;
            li.addEventListener('click', () => {
                loadContent(index);
                // Style Active Item
                document.querySelectorAll('#chapter-list li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                // Mobile Sidebar Close
                if(window.innerWidth < 768) sidebar.classList.remove('active');
            });
            chapterList.appendChild(li);
        });
    }

    // 2. Load Content
    function loadContent(index) {
        const chapter = bookData[index];
        const orderButton = `
            <div style="margin-top: 40px; text-align: center;">
                <p style="color: #666; margin-bottom:10px;">এমন একটি অ্যাপ আপনার স্কুলের জন্য বানাতে চান?</p>
                <a href="https://demand-supply.vercel.app/" target="_blank" class="order-btn">
                    🛒 অর্ডার করতে ক্লিক করুন
                </a>
            </div>
        `;

        let rawContent = `
            <div class="page-content fade-in">
                ${chapter.content}
                ${orderButton}
                <div style="margin-top: 30px; text-align: center; display:flex; justify-content:space-between;">
                     ${index > 0 ? 
                        `<button class="primary-btn" style="padding:10px 20px; font-size:1rem;" onclick="loadChapterByIndex(${index - 1})">⬅️ আগের</button>` : '<span></span>'}
                    
                    ${index < bookData.length - 1 ? 
                        `<button class="primary-btn" style="padding:10px 20px; font-size:1rem;" onclick="loadChapterByIndex(${index + 1})">পরের ➡️</button>` : 
                        '<p>--- সমাপ্ত ---</p>'}
                </div>
            </div>
        `;

        // Image Replacement Logic
        try {
            const regex = new RegExp("\\", "g");
            rawContent = rawContent.replace(regex, function(match, text) {
                const filename = text.trim();
                const fullFilenameEncoded = encodeURIComponent(filename) + IMAGE_EXTENSION;
                const finalImageUrl = githubBaseUrl + fullFilenameEncoded;
                return `<img src="${finalImageUrl}" alt="${filename}" style="width:100%; max-height:300px; object-fit:contain; border-radius:10px; margin:15px 0; border:2px solid #eee;" onerror="this.style.display='none'">`;
            });
        } catch (e) { console.error(e); }

        bookContent.innerHTML = rawContent;
        document.querySelector('.content-area').scrollTop = 0;
        
        // Highlight menu item
        const items = document.querySelectorAll('#chapter-list li');
        if(items[index]) {
            items.forEach(l => l.classList.remove('active'));
            items[index].classList.add('active');
        }
    }

    // Helper for navigation buttons
    window.loadChapterByIndex = (index) => {
        loadContent(index);
    }

    // 3. Event Listeners
    const startBtn = document.getElementById('start-reading-btn');
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            landingPage.classList.add('hidden');
            readerPage.classList.remove('hidden');
            loadContent(0); // Load first chapter
        });
    }

    const toggleBtn = document.getElementById('toggle-sidebar');
    if(toggleBtn) toggleBtn.addEventListener('click', () => sidebar.classList.add('active'));
    
    const closeBtn = document.getElementById('close-sidebar');
    if(closeBtn) closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));

    loadChapters();
});

// PWA Install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('installBtn');
    if(btn) {
        btn.style.display = 'block';
        btn.addEventListener('click', () => {
            btn.style.display = 'none';
            if(deferredPrompt) deferredPrompt.prompt();
            deferredPrompt = null;
        });
    }
});
