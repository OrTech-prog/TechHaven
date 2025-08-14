// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const searchInput = document.querySelector('.search-input');
const ctaButton = document.querySelector('.cta-button');
const contactForm = document.querySelector('.contact-form');

// Shopping Cart Data
let cart = [];
let cartItemCount = 0;
let cartTotalAmount = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
    updateCartDisplay();
    setupSmoothScrolling();
});

// Event Listeners
function initializeEventListeners() {
    // Mobile Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Cart Modal
    cartIcon.addEventListener('click', openCartModal);
    closeCart.addEventListener('click', closeCartModal);
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Product Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterProducts);
    });
    
    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Search Functionality
    searchInput.addEventListener('input', searchProducts);
    
    // CTA Button
    ctaButton.addEventListener('click', function() {
        document.getElementById('products').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll animations
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', showQuickView);
    });
}

// Mobile Navigation
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.style.transition = 'all 0.3s ease');
    
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Cart Modal Functions
function openCartModal() {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
        cartModal.style.opacity = '1';
        const cartContent = document.querySelector('.cart-content');
        cartContent.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function closeCartModal() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.style.transform = 'translate(-50%, -50%) scale(0.9)';
    cartModal.style.opacity = '0';
    
    setTimeout(() => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Product Filtering
function filterProducts(e) {
    const category = e.target.getAttribute('data-category');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter products with animation
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.classList.add('visible');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update grid layout
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.product-card.visible');
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
}

// Add to Cart Functionality
function addToCart(e) {
    const button = e.target;
    const productName = button.getAttribute('data-product');
    const productPrice = parseInt(button.getAttribute('data-price'));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartAnimation(button);
    
    // Show success message
    showNotification(`${productName} added to cart!`, 'success');
}

function updateCartDisplay() {
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count
    cartCount.textContent = cartItemCount;
    cartTotal.textContent = cartTotalAmount.toLocaleString('en-ZA');
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="item-price">R${(item.price * item.quantity).toLocaleString('en-ZA')}</div>
            </div>
        `).join('');
    }
}

function showAddToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = 'linear-gradient(45deg, #10b981, #059669)';
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(45deg, #2563eb, #7c3aed)';
        button.style.transform = 'scale(1)';
    }, 1000);
}

// Search Functionality
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('visible');
            card.classList.remove('hidden');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
    
    // Reset filter buttons if searching
    if (searchTerm) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
    }
}

// Quick View Functionality
function showQuickView(e) {
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productPrice = productCard.querySelector('.current-price').textContent;
    const productSpecs = Array.from(productCard.querySelectorAll('.product-specs span')).map(spec => spec.textContent);
    
    // Create quick view modal
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'quick-view-modal';
    quickViewModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
    `;
    
    quickViewModal.innerHTML = `
        <div class="quick-view-content" style="
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            padding: 2rem;
            position: relative;
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s ease;
        ">
            <button class="close-quick-view" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #6b7280;
            ">&times;</button>
            <h2 style="color: #1f2937; margin-bottom: 1rem;">${productName}</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">${productDescription}</p>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                ${productSpecs.map(spec => `<span style="background: #f3f4f6; color: #374151; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500;">${spec}</span>`).join('')}
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb; margin-bottom: 2rem;">${productPrice}</div>
            <button class="add-to-cart-quick" style="
                width: 100%;
                background: linear-gradient(45deg, #2563eb, #7c3aed);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Add to Cart</button>
        </div>
    `;
    
    document.body.appendChild(quickViewModal);
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
        quickViewModal.style.opacity = '1';
        const content = quickViewModal.querySelector('.quick-view-content');
        content.style.transform = 'scale(1)';
        content.style.opacity = '1';
    }, 10);
    
    // Close functionality
    const closeBtn = quickViewModal.querySelector('.close-quick-view');
    closeBtn.addEventListener('click', () => {
        const content = quickViewModal.querySelector('.quick-view-content');
        content.style.transform = 'scale(0.9)';
        content.style.opacity = '0';
        quickViewModal.style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(quickViewModal);
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    // Add to cart from quick view
    const addToCartQuick = quickViewModal.querySelector('.add-to-cart-quick');
    addToCartQuick.addEventListener('click', () => {
        const originalBtn = productCard.querySelector('.add-to-cart-btn');
        addToCart({ target: originalBtn });
        closeBtn.click();
    });
    
    // Close on outside click
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            closeBtn.click();
        }
    });
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 4000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Animation out
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .feature-card, .product-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Initialize Animations
function initializeAnimations() {
    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.feature-card, .about-text, .contact-item');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat h3');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

// Counter Animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        element.textContent = displayValue >= 1000 ? 
            (displayValue / 1000).toFixed(0) + 'K' + suffix : 
            displayValue + suffix;
    }, 16);
}

// Checkout Functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // Simulate checkout process
        const checkoutBtn = e.target;
        const originalText = checkoutBtn.textContent;
        
        checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
        checkoutBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Order placed successfully! Thank you for your purchase.', 'success');
            cart = [];
            updateCartDisplay();
            closeCartModal();
            
            checkoutBtn.textContent = originalText;
            checkoutBtn.disabled = false;
        }, 3000);
    }
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(handleScrollAnimations, 10));

// Lazy loading for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Service Worker Registration (for better performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

console.log('TechHaven website loaded successfully! 🚀');