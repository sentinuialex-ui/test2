let giftWrapper, giftBox, cutePopup, messageFrame, bloomOverlay;
let confirmOpenBtn, cancelPopupBtn;

function decodeData(base64String) {
    try {
        if (!base64String) return null;
        return decodeURIComponent(escape(window.atob(base64String)));
    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}

function updateGiftContent() {
    const params = new URLSearchParams(window.location.search);
    let title = '';
    let msg = '';
    const spotifyId = params.get('spotify'); 

    // เช็คว่าส่งมาแบบเข้ารหัส (?q=...) หรือแบบธรรมดา
    if (params.has('q')) {
        try {
            const decodedJson = LZString.decompressFromEncodedURIComponent(params.get('q'));
            const data = JSON.parse(decodedJson);
            title = data.t;
            msg = data.m;
        } catch (e) {
            console.error("Decoding error:", e);
            title = "เกิดข้อผิดพลาด";
            msg = "ไม่สามารถอ่านข้อความได้";
        }
    } else {
        // รองรับ QR Code ตัวเก่าๆ ที่เคยทำไว้
        title = params.get('title');
        msg = params.get('msg');
    }
    
    const titleEl = document.getElementById('dynamicTitle');
    const msgEl = document.getElementById('dynamicMessage');
    const spotifyContainer = document.getElementById('spotifyContainer'); 
    
    if (titleEl) titleEl.innerHTML = title ? title.replace(/\n/g, '<br>') : '';
    if (msgEl) msgEl.innerHTML = msg ? msg.replace(/\n/g, '<br>') : '';

    if (spotifyId && spotifyContainer) {
        spotifyContainer.innerHTML = `
            <iframe style="border-radius:12px; margin-top: 15px;" 
                src="https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0" 
                width="100%" height="80" frameBorder="0" allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
            </iframe>
        `;
    }
}

function showPopup() {
    giftWrapper.classList.add('hidden');
    cutePopup.classList.remove('hidden');
}

function confirmOpen() {
    cutePopup.classList.add('hidden');
    bloomOverlay.classList.add('active'); 
    
    setTimeout(() => {
        messageFrame.classList.remove('hidden');
        messageFrame.classList.add('show');
        bloomOverlay.classList.remove('active'); 
        document.body.classList.add('is-open');

        if (typeof VanillaTilt !== 'undefined') {
            setTimeout(() => {
                const panel = document.querySelector(".glass-panel");
                if(panel) {
                    VanillaTilt.init(panel, {
                        max: 12, speed: 800, glare: true, "max-glare": 0.2, scale: 1.05
                    });
                }
            }, 800);
        }
    }, 1500);
}

function cancelOpen() {
    cutePopup.classList.add('hidden');
    giftWrapper.classList.remove('hidden');
}

function createFloatingIcon() {
    const icons = ['favorite', 'star', 'auto_awesome', 'volunteer_activism', 'redeem'];
    const colors = ['#ffb7c5', '#ffd0dc', '#ffffff', '#ff9eaa', '#f0dde4'];
    
    const icon = document.createElement('span');
    icon.className = 'material-symbols-rounded';
    icon.innerText = icons[Math.floor(Math.random() * icons.length)];
    
    icon.style.color = colors[Math.floor(Math.random() * colors.length)];
    icon.style.position = 'fixed';
    icon.style.fontVariationSettings = "'FILL' 1"; 

    const startX = Math.random() * 100;
    const swayAmount = (Math.random() * 20) - 10; 

    icon.style.left = startX + 'vw';
    icon.style.top = '110vh';
    icon.style.fontSize = (Math.random() * 15 + 20) + 'px'; 
    icon.style.opacity = '0';
    icon.style.filter = `drop-shadow(0 0 8px ${icon.style.color})`;
    icon.style.zIndex = '9998';
    icon.style.pointerEvents = 'none';
    
    document.body.appendChild(icon);

    const duration = Math.random() * 6000 + 5000; 
    const baseOpacity = Math.random() * 0.4 + 0.2;

    icon.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 0 },
        { opacity: baseOpacity, offset: 0.1 }, 
        { transform: `translate(${swayAmount}vw, -50vh) rotate(${Math.random() * 180}deg)`, offset: 0.5 }, 
        { transform: `translate(${swayAmount * -0.5}vw, -120vh) rotate(${Math.random() * 360}deg)`, opacity: 0 } 
    ], { 
        duration: duration, 
        easing: 'ease-in-out' 
    }).onfinish = () => icon.remove();
}

window.addEventListener('DOMContentLoaded', () => {
    giftWrapper = document.getElementById('giftWrapper');
    giftBox = document.getElementById('giftBox');
    cutePopup = document.getElementById('cutePopup');
    messageFrame = document.getElementById('messageFrame');
    bloomOverlay = document.getElementById('bloom-overlay');
    confirmOpenBtn = document.getElementById('confirmOpenBtn');
    cancelPopupBtn = document.getElementById('cancelPopupBtn');
    
    if (giftBox) giftBox.addEventListener('click', showPopup);
    if (confirmOpenBtn) confirmOpenBtn.addEventListener('click', confirmOpen);
    if (cancelPopupBtn) cancelPopupBtn.addEventListener('click', cancelOpen);

    updateGiftContent();
    
    setInterval(createFloatingIcon, 800);
});