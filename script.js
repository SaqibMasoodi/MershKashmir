// --- DATA HANDLING ---
const provisionsData = (typeof generatedData !== 'undefined') ? generatedData.dryfruit : [];
const wearablesData = (typeof generatedData !== 'undefined') ? generatedData.wearable : [];

// Static About Data
const aboutData = {
    wearable: [
        { icon: 'fa-map-marker', color: 'text-earth-olive', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-olive', title: 'Our Roots', desc: 'Based in Kashmir, reflecting local craftsmanship and natural produce.' },
        { icon: 'fa-shopping-bag', color: 'text-earth-clay', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-clay', title: 'Our Products', desc: 'Premium ethnic wear and hand-picked dry fruits, curated for quality and authenticity.' },
        { icon: 'fa-whatsapp', color: 'text-earth-mustard', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-mustard', title: 'Our Process', desc: 'Every order is personally reviewed and confirmed via WhatsApp.' }
    ],
    dryfruit: [
        { icon: 'fa-map-marker', color: 'text-earth-olive', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-olive', title: 'Our Roots', desc: 'Based in Kashmir, reflecting local craftsmanship and natural produce.' },
        { icon: 'fa-shopping-bag', color: 'text-earth-clay', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-clay', title: 'Our Products', desc: 'Premium ethnic wear and hand-picked dry fruits, curated for quality and authenticity.' },
        { icon: 'fa-whatsapp', color: 'text-earth-mustard', bg: 'bg-earth-secondary', hoverBg: 'group-hover:bg-earth-mustard', title: 'Our Process', desc: 'Every order is personally reviewed and confirmed via WhatsApp.' }
    ]
};

let cartItems = [];
let wishlistItems = [];

// --- RENDER LOGIC ---

function renderAbout(type) {
    const container = document.getElementById('aboutGrid');
    const data = aboutData[type];
    container.innerHTML = data.map(item => `
        <div class="flex items-start gap-4 group">
            <div class="p-4 ${item.bg} rounded-full ${item.color} ${item.hoverBg} group-hover:text-white transition-colors shrink-0">
                <i class="fa ${item.icon} text-xl"></i>
            </div>
            <div>
                <h3 class="font-serif font-bold text-xl text-earth-text mb-2">${item.title}</h3>
                <p class="text-sm text-earth-lighttext leading-relaxed">${item.desc}</p>
            </div>
        </div>
    `).join('');
}

// 2. Generate Product Cards (Grid)
function generateProductHTML(item, masterIndex, type) {
    const isComingSoon = item.price === 0;
    
    // Fallback Image
    const imgSrc = item.image; 
    const fallbackImg = "assets/dummy.png";

    let heartButtonHtml = '';
    if (!isComingSoon) {
        const inWishlist = wishlistItems.some(w => w.name === item.name);
        const heartClass = inWishlist ? 'text-red-500' : 'text-gray-300';
        const heartIcon = inWishlist ? 'fa-heart' : 'fa-heart-o';
        heartButtonHtml = `
            <button class="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center ${heartClass} hover:text-red-500 transition-colors" onclick="toggleHeart(event, '${type}', ${masterIndex})">
                <i class="fa ${heartIcon} text-base md:text-lg"></i>
            </button>`;
    }

    const clickAttr = isComingSoon ? '' : `onclick="openProductModal('${type}', ${masterIndex})"`;
    const cursorClass = isComingSoon ? 'cursor-default' : 'cursor-pointer';
    const hoverClass = isComingSoon ? '' : 'group-hover:scale-105'; 

    const priceDisplay = isComingSoon 
        ? `<span class="text-earth-lighttext text-sm font-bold italic tracking-widest uppercase">Coming Soon</span>` 
        : `<span class="font-bold text-earth-mustard text-base min-[361px]:text-sm md:text-lg whitespace-nowrap">₹ ${item.price.toLocaleString()}</span>`;

    const buttonDisplay = isComingSoon
        ? `<button disabled class="bg-earth-secondary text-earth-lighttext w-full md:w-auto px-3 py-2 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold shadow-none uppercase tracking-widest whitespace-nowrap min-h-[44px] cursor-not-allowed opacity-50 flex items-center justify-center">
               Stay Tuned
           </button>`
        : `<button onclick="addToCart('${type}', ${masterIndex})" class="bg-earth-text text-earth-base w-full md:w-auto px-3 py-2 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold hover:bg-earth-clay transition-all shadow-md uppercase tracking-widest whitespace-nowrap min-h-[44px] flex items-center justify-center">
               Add to Cart
           </button>`;

    return `
        <div class="bg-white border border-earth-secondary rounded-xl md:rounded-[2rem] p-2 min-[361px]:p-3 md:p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full no-hover-mobile">
            ${heartButtonHtml}
            <div class="h-48 min-[361px]:h-36 md:h-64 rounded-lg md:rounded-[1.5rem] bg-gray-100 mb-2 md:mb-4 overflow-hidden ${cursorClass} shrink-0" ${clickAttr}>
                 <img src="${imgSrc}" onerror="this.src='${fallbackImg}'" class="w-full h-full object-cover ${hoverClass} transition-transform duration-500" alt="${item.name}">
            </div>
            <div class="flex-grow">
                <h3 class="font-serif font-bold text-lg min-[361px]:text-sm md:text-xl text-earth-text leading-tight">${item.name}</h3>
                <p class="text-[10px] md:text-sm text-earth-lighttext mt-1 truncate min-[361px]:line-clamp-1 min-[361px]:whitespace-normal md:whitespace-nowrap">${item.description}</p>
            </div>
            <div class="flex flex-col min-[361px]:flex-col md:flex-row justify-between items-start md:items-center border-t border-earth-secondary pt-3 md:pt-4 mt-2 md:mt-4 gap-2">
                ${priceDisplay}
                ${buttonDisplay}
            </div>
        </div>
    `;
}

// 3. View More / Less Toggle
function toggleViewMore(catId, btn) {
    const moreDiv = document.getElementById(`more-${catId}`);
    if (moreDiv.classList.contains('hidden')) {
        moreDiv.classList.remove('hidden');
        btn.innerText = "View Less";
    } else {
        moreDiv.classList.add('hidden');
        btn.innerText = "View Complete Collection";
    }
}

// 4. Main Render Function
function renderCatalogs() {
    // --- RENDER PROVISIONS ---
    const pContainer = document.getElementById('provisionsContainer');
    if(pContainer) {
        const provisionCats = [
            { id: 'saffron', title: 'The Red Gold Collection', desc: 'World\'s finest saffron from Pampore', filter: i => i.tags && i.tags.includes('saffron') },
            { id: 'nuts', title: 'Orchard Fresh Kernels', desc: 'Crunchy, sweet, and oil-rich', filter: i => i.tags && i.tags.includes('nuts') },
            { id: 'fruits', title: 'Sun-Dried Preserves', desc: 'Natural sweetness preserved by the sun', filter: i => i.tags && i.tags.includes('fruits') },
            { id: 'brews', title: 'Brews & Nectars', desc: 'Warm Kahwa and pure honey', filter: i => i.tags && i.tags.includes('brews') }
        ];

        let pContent = '';
        const itemsLimit = 4;

        provisionCats.forEach((cat, index) => {
            const filteredItems = provisionsData
                .map((item, index) => ({ item, index }))
                .filter(obj => cat.filter(obj.item));

            if(filteredItems.length > 0) {
                const isEven = index % 2 === 0;
                const bgClass = isEven ? 'bg-earth-text' : 'bg-earth-mustard';
                const textClass = isEven ? 'text-earth-base' : 'text-earth-text';
                const subTextClass = isEven ? 'text-earth-mustard' : 'text-white/80';
                const wrapperClass = `${bgClass} ${textClass} py-12 md:py-16 px-4 rounded-[2rem] md:rounded-[3rem] mx-2 md:mx-6 transition-opacity duration-300 shadow-xl`;
                const gridClass = 'grid grid-cols-1 min-[361px]:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6';

                const initialItems = filteredItems.slice(0, itemsLimit);
                const hasMore = filteredItems.length > itemsLimit;
                const hiddenItemsHTML = hasMore ? filteredItems.slice(itemsLimit).map(obj => generateProductHTML(obj.item, obj.index, 'dryfruit')).join('') : '';
                
                const viewMoreBtn = hasMore ? `
                    <div class="text-center mt-8 md:mt-12">
                        <button onclick="toggleViewMore('${cat.id}', this)" class="bg-earth-text text-white font-bold rounded-full py-3 px-8 uppercase tracking-widest text-xs hover:bg-earth-clay transition-all shadow-md min-h-[44px]">
                            View Complete Collection
                        </button>
                    </div>
                ` : '';

                pContent += `
                    <div class="${wrapperClass}">
                        <div class="max-w-7xl mx-auto">
                            <div class="text-center mb-8 md:mb-12">
                                <h2 class="text-3xl md:text-4xl font-serif font-bold mb-2">${cat.title}</h2>
                                <p class="${subTextClass} font-medium italic">${cat.desc}</p>
                            </div>
                            <div class="${gridClass}">
                                ${initialItems.map(obj => generateProductHTML(obj.item, obj.index, 'dryfruit')).join('')}
                            </div>
                            <div id="more-${cat.id}" class="${gridClass} mt-6 hidden">
                                ${hiddenItemsHTML}
                            </div>
                            ${viewMoreBtn}
                        </div>
                    </div>
                `;
            }
        });
        pContainer.innerHTML = pContent;
    }

    // --- RENDER WEARABLES ---
    const wContainer = document.getElementById('wearablesContainer');
    if(wContainer) {
        const categories = [
            { id: 'heritage', title: 'Pure & Heritage Shawls', desc: 'Timeless masterpieces', filter: i => i.tags && i.tags.includes('heritage') },
            { id: 'kani', title: 'Kani & Pattern-Rich', desc: 'Woven stories of nature', filter: i => i.tags && (i.tags.includes('kani') || i.tags.includes('pattern')) },
            { id: 'everyday', title: 'Everyday Wraps & Stoles', desc: 'Elegant simplicity for daily wear', filter: i => i.tags && i.tags.includes('everyday') },
            { id: 'feran', title: 'Traditional Garments', desc: 'Authentic Ferans and outerwear', filter: i => i.tags && i.tags.includes('feran') },
            { id: 'embroidery', title: 'Embroidery Spotlight', desc: 'Sozni, Aari & Hand Embroidery', filter: i => i.tags && i.tags.includes('embroidery') },
            { id: 'suit', title: 'Suits & Dress Materials', desc: 'Tailor your own style', filter: i => i.tags && i.tags.includes('suit') },
            { id: 'accessory', title: 'Accessories', desc: 'The perfect finishing touch', filter: i => i.tags && i.tags.includes('accessory') }
        ];

        const bgColors = ['bg-earth-base', 'bg-earth-secondary', 'bg-white'];
        let htmlContent = '';
        const itemsLimit = 4;

        categories.forEach((cat, catIndex) => {
            const filteredItems = wearablesData.map((item, index) => ({ item, index })).filter(obj => cat.filter(obj.item));
            if(filteredItems.length > 0) {
                const bgClass = bgColors[catIndex % 3];
                const shadowClass = 'shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]';
                const wrapperClass = `${bgClass} ${shadowClass} py-12 md:py-16 px-4 rounded-[2rem] md:rounded-[3rem] mx-2 md:mx-6`;
                const gridClass = 'grid grid-cols-1 min-[361px]:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6';

                const initialItems = filteredItems.slice(0, itemsLimit);
                const hasMore = filteredItems.length > itemsLimit;
                const hiddenItemsHTML = hasMore ? filteredItems.slice(itemsLimit).map(obj => generateProductHTML(obj.item, obj.index, 'wearable')).join('') : '';
                
                const viewMoreBtn = hasMore ? `
                    <div class="text-center mt-8 md:mt-12">
                        <button onclick="toggleViewMore('${cat.id}', this)" class="bg-earth-text text-white font-bold rounded-full py-3 px-8 uppercase tracking-widest text-xs hover:bg-earth-clay transition-all shadow-md min-h-[44px]">
                            View Complete Collection
                        </button>
                    </div>
                ` : '';

                htmlContent += `
                    <div class="${wrapperClass}">
                        <div class="max-w-7xl mx-auto">
                            <div class="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 border-b border-earth-text/10 pb-4">
                                <div>
                                    <h3 class="text-2xl md:text-3xl font-serif font-bold text-earth-text">${cat.title}</h3>
                                    <p class="text-earth-lighttext mt-1 italic">${cat.desc}</p>
                                </div>
                                <div class="hidden md:block text-xs uppercase tracking-widest text-earth-mustard font-bold">Collection</div>
                            </div>
                            <div class="${gridClass}">
                                ${initialItems.map(obj => generateProductHTML(obj.item, obj.index, 'wearable')).join('')}
                            </div>
                            <div id="more-${cat.id}" class="${gridClass} mt-6 hidden">
                                ${hiddenItemsHTML}
                            </div>
                            ${viewMoreBtn}
                        </div>
                    </div>
                `;
            }
        });
        wContainer.innerHTML = htmlContent;
    }
}

// --- COMMON ACTIONS ---
function setCategory(category) {
    const wearablesSec = document.getElementById('wearables');
    const dryfruitsSec = document.getElementById('dryfruits');
    const toggleBg = document.getElementById('toggleBg');
    const btnWear = document.getElementById('btn-wearable');
    const btnDry = document.getElementById('btn-dryfruit');

    if (category === 'wearable') {
        wearablesSec.classList.remove('hidden');
        dryfruitsSec.classList.add('hidden');
        toggleBg.style.transform = 'translateX(0)';
        btnWear.classList.remove('text-earth-lighttext');
        btnWear.classList.add('text-earth-text');
        btnDry.classList.remove('text-earth-text');
        btnDry.classList.add('text-earth-lighttext');
        renderAbout('wearable'); 
    } else {
        wearablesSec.classList.add('hidden');
        dryfruitsSec.classList.remove('hidden');
        toggleBg.style.transform = 'translateX(100%)';
        btnWear.classList.add('text-earth-lighttext');
        btnWear.classList.remove('text-earth-text');
        btnDry.classList.add('text-earth-text');
        btnDry.classList.remove('text-earth-lighttext');
        renderAbout('dryfruit'); 
    }
}

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    if(sidebar.classList.contains('closed')) {
        sidebar.classList.remove('closed');
        sidebar.classList.add('active');
        document.getElementById("wishlistSidebar").classList.add('closed');
    } else {
        sidebar.classList.add('closed');
        sidebar.classList.remove('active');
    }
}
function toggleWishlist() {
    const sidebar = document.getElementById("wishlistSidebar");
    if(sidebar.classList.contains('closed')) {
        sidebar.classList.remove('closed');
        sidebar.classList.add('active');
        document.getElementById("cartSidebar").classList.add('closed');
    } else {
        sidebar.classList.add('closed');
        sidebar.classList.remove('active');
    }
}

function closeProductModal() { document.getElementById('productDetailModal').classList.add('hidden'); }
function closeCheckoutModal() { document.getElementById('checkoutModal').classList.add('hidden'); }

function getProduct(type, index) { return type === 'dryfruit' ? provisionsData[index] : wearablesData[index]; }

function addToCart(type, index) {
    const product = getProduct(type, index);
    addToCartObject(product);
}

function addToCartObject(product) {
    if(product.price === 0) return;
    const existingItem = cartItems.find(item => item.name === product.name);
    if (existingItem) { existingItem.quantity += 1; } else { cartItems.push({ ...product, quantity: 1 }); }
    updateCartUI();
    const cart = document.getElementById("cartSidebar");
    if(cart.classList.contains('closed')) toggleCart();
}

function updateQuantity(index, change) {
    if (cartItems[index].quantity + change > 0) { cartItems[index].quantity += change; }
    updateCartUI();
}
function removeItem(index) {
    cartItems.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cartContent");
    const checkout = document.getElementById("checkoutArea");
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById("cartCount").innerText = totalCount;

    if(cartItems.length === 0) {
        container.innerHTML = '<p class="text-center text-earth-lighttext mt-10">Your basket is currently empty.</p>';
        checkout.classList.add('hidden');
        return;
    }

    checkout.classList.remove('hidden');
    let total = 0;

    container.innerHTML = cartItems.map((item, index) => {
        total += item.price * item.quantity;
        return `
            <div class="flex justify-between items-center mb-4 bg-white p-3 rounded-xl border border-earth-secondary/50">
                <div class="w-1/2">
                    <div class="font-bold text-earth-text text-sm">${item.name}</div>
                    <small class="text-earth-lighttext">₹ ${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <div class="flex items-center bg-gray-100 rounded-lg">
                    <button class="px-3 py-2 text-earth-text hover:text-earth-mustard font-bold" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="px-2 text-sm font-bold">${item.quantity}</span>
                    <button class="px-3 py-2 text-earth-text hover:text-earth-mustard font-bold" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="w-1/5 text-right flex flex-col items-end">
                        <small class="font-bold text-earth-mustard">₹ ${(item.price * item.quantity).toLocaleString()}</small>
                        <button class="text-red-400 hover:text-red-600 text-xs mt-1 p-2" onclick="removeItem(${index})"><i class="fa fa-times"></i></button>
                </div>
            </div>`;
    }).join('');

    document.getElementById("totalDisplay").innerText = "₹ " + total.toLocaleString();

    const oldBtn = document.getElementById("checkoutBtnDynamic");
    if(oldBtn) oldBtn.remove();
    
    const btn = document.createElement("button");
    btn.id = "checkoutBtnDynamic";
    btn.className = "w-full py-4 rounded-full bg-earth-text text-white font-bold hover:bg-earth-clay transition-colors mt-4 uppercase tracking-wider text-sm min-h-[50px]";
    btn.innerHTML = `Proceed to Checkout <i class="fa fa-arrow-right ml-2"></i>`;
    btn.onclick = function() { openOrderModal(total); };
    checkout.appendChild(btn);
}

function toggleHeart(event, type, index) {
    event.stopPropagation(); 
    const product = getProduct(type, index);
    if(product.price === 0) return; 

    const existingIndex = wishlistItems.findIndex(item => item.name === product.name);
    if (existingIndex > -1) { wishlistItems.splice(existingIndex, 1); } else { wishlistItems.push(product); }
    renderCatalogs(); renderWishlist(); 
}

function renderWishlist() {
    const container = document.getElementById("wishlistContent");
    const actions = document.getElementById("wishlistActions");
    const totalDisplay = document.getElementById("wishlistTotalDisplay");
    
    document.getElementById("wishlistCount").innerText = wishlistItems.length;
    
    if(wishlistItems.length === 0) {
        container.innerHTML = '<p class="text-center text-earth-lighttext mt-10">Your wishlist is empty.</p>';
        actions.classList.add('hidden');
        return;
    }
    
    actions.classList.remove('hidden');
    let total = 0;

    container.innerHTML = wishlistItems.map((item, index) => {
        total += item.price;
        return `
        <div class="flex justify-between items-center mb-3 p-3 bg-white rounded-xl border border-earth-secondary/50">
            <div class="flex items-center">
                <img src="${item.image}" onerror="this.src='assets/dummy.png'" class="w-12 h-12 object-cover rounded-lg mr-3">
                <div>
                    <div class="font-bold text-earth-text text-sm truncate w-24">${item.name}</div>
                    <small class="text-earth-mustard">₹ ${item.price.toLocaleString()}</small>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="bg-earth-secondary text-earth-text p-3 md:p-2 rounded-full text-xs hover:bg-earth-mustard hover:text-white transition-colors" title="Move to Cart" onclick="moveOneToCart(${index})">
                    <i class="fa fa-shopping-bag"></i>
                </button>
                <button class="text-gray-400 hover:text-red-500 p-2" onclick="removeFromWishlist(${index})">&times;</button>
            </div>
        </div>
    `}).join('');
    
    totalDisplay.innerText = "₹ " + total.toLocaleString();
}

function removeFromWishlist(index) { wishlistItems.splice(index, 1); renderWishlist(); renderCatalogs(); }

function moveOneToCart(index) {
    const item = wishlistItems[index];
    addToCartObject(item);
    removeFromWishlist(index);
}

function moveAllToCart() {
    wishlistItems.forEach(item => {
        const existingItem = cartItems.find(c => c.name === item.name);
        if (existingItem) { existingItem.quantity += 1; } else { cartItems.push({ ...item, quantity: 1 }); }
    });
    wishlistItems = [];
    renderWishlist();
    renderCatalogs();
    updateCartUI();
    toggleCart();
}

function openProductModal(type, index) {
    const product = getProduct(type, index);
    
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalPrice').innerText = `₹ ${product.price.toLocaleString()}`;
    document.getElementById('modalDesc').innerText = product.description;
    const mainImg = document.getElementById('modalMainImg');
    
    const gallery = product.gallery || [product.image];
    mainImg.src = gallery[0]; 
    mainImg.onerror = function() { this.src = "assets/dummy.png"; };
    
    document.getElementById('modalThumbnails').innerHTML = gallery.map(src => 
        `<img src="${src}" onerror="this.src='assets/dummy.png'" class="w-16 h-16 object-cover rounded border border-earth-secondary hover:border-earth-mustard cursor-pointer" onclick="changeModalImage(this.src)">`
    ).join('');
    
    const btn = document.getElementById('modalAddToCartBtn');
    if (product.price === 0) {
        btn.innerText = "Stay Tuned";
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.onclick = null;
    } else {
        btn.innerText = "Add to Cart";
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.onclick = function() { addToCart(type, index); closeProductModal(); };
    }

    document.getElementById('productDetailModal').classList.remove('hidden');
}
function changeModalImage(src) { document.getElementById('modalMainImg').src = src; }

function openOrderModal(total) {
    toggleCart(); 
    document.getElementById("checkoutTotalAmount").innerText = "₹ " + total.toLocaleString();
    document.getElementById('checkoutModal').classList.remove('hidden');
}

function submitOrderForm(event) {
    event.preventDefault(); 
    
    const name = document.getElementById("c_name").value;
    const phone = document.getElementById("c_phone").value;
    const email = document.getElementById("c_email").value;
    const address = document.getElementById("c_address").value;
    const city = document.getElementById("c_city").value;
    const zip = document.getElementById("c_zip").value;
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const date = new Date();
    const dateStr = date.toISOString().slice(0,10).replace(/-/g,'');
    const timeStr = date.toTimeString().slice(0,5).replace(/:/g,'');
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    const orderId = `ORD-${dateStr}-${timeStr}-${randomSuffix}`;
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    const submitBtn = document.querySelector('.btn-whatsapp-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("MERSH KASHMIR", 105, 20, null, null, "center");
        doc.setFontSize(16);
        doc.text("Order Receipt", 105, 30, null, null, "center");
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Customer Details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Order ID: ${orderId}`, 20, 45);
        doc.text(`Date: ${formattedDate}`, 20, 50);
        doc.text(`Customer: ${name}`, 20, 60);
        doc.text(`Phone: ${phone}`, 20, 65);
        doc.text(`Address: ${address}, ${city} - ${zip}`, 20, 70);
        
        // Order Table Header
        doc.setFont("helvetica", "bold");
        doc.text("Items Ordered:", 20, 85);
        doc.setFont("helvetica", "normal");
        
        let yPos = 92;

        // Loop through items with separate section line
        cartItems.forEach(item => {
            const sectionName = (item.tags && item.tags[1]) ? item.tags[1].toUpperCase() : 'General';
            
            // Line 1: Name and Price (Boldish)
            doc.setFont("helvetica", "bold");
            const line1 = `${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`;
            const splitTitle = doc.splitTextToSize(line1, 170);
            doc.text(splitTitle, 20, yPos);
            yPos += (5 * splitTitle.length);
            
            // Line 2: Section (Italic, indented)
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8); 
            doc.text(`(Section: ${sectionName})`, 25, yPos); 
            
            // Reset for next item
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            yPos += 7; // Add spacing between items
            
            // Page break check if list is long
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
        
        yPos += 5;
        doc.setLineWidth(0.2);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`Total Amount: Rs. ${total.toLocaleString()}`, 20, yPos);
        yPos += 20;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Payment & delivery will be completed via WhatsApp.", 105, yPos, null, null, "center");

        doc.save(`${orderId}.pdf`);

        setTimeout(() => {
            const adminPhone = "919810906692"; 
            
            // UPDATED WHATSAPP LIST FORMAT
            const waItemsList = cartItems.map(item => {
                const sectionName = (item.tags && item.tags[1]) ? item.tags[1].toUpperCase() : 'General';
                return `• *${item.name}*\n   └ Section: ${sectionName}\n   └ Qty: ${item.quantity} | ₹ ${(item.price * item.quantity).toLocaleString()}`;
            }).join('\n\n');

            let message = `🧾 *ORDER CONFIRMATION*\n`;
            message += `Order ID: ${orderId}\n`;
            message += `Date: ${formattedDate}\n\n`;
            message += `👤 *Customer Details*\n`;
            message += `Name: ${name}\n`;
            message += `Phone: ${phone}\n`;
            message += `Email: ${email}\n\n`;
            message += `🛍 *Order Items*\n`;
            message += `${waItemsList}\n\n`;
            message += `💰 *Order Total*\n`;
            message += `₹ ${total.toLocaleString()}\n\n`;
            message += `📄 *Delivery Details*\n`;
            message += `Address: ${address}\n`;
            message += `City: ${city}\n`;
            message += `Zip: ${zip}\n\n`;
            message += `📦 *Next Steps*\n`;
            message += `Our team will confirm availability and payment details on WhatsApp.\n\n`;
            message += `Thank you for choosing us 🤍\n`;
            
            const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
            
            cartItems = [];
            updateCartUI();
            closeCheckoutModal();
            document.getElementById("checkoutForm").reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            window.location.href = url;
        }, 1000);

    } catch (err) {
        console.error("PDF Gen Error:", err);
        alert("Error generating receipt. Redirecting to WhatsApp...");
        const adminPhone = "919810906692"; 
        const message = `*New Order (PDF Failed)*\nName: ${name}\nTotal: ${total}`;
        window.location.href = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => { 
    renderCatalogs(); 
    setCategory('wearable');
});