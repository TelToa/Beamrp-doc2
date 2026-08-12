setTimeout(function () {
    const preCon = document.querySelector('.se-pre-con');
    if (preCon) {
        preCon.remove();
    }
}, 400);

function checkLink(docName) {
    const firstLink = docName;
    const secondLink = docName + '.html';

    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', firstLink, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = firstLink;
        } else {
            window.location.href = secondLink;
        }
    };

    xhr.onerror = function () {
        window.location.href = secondLink;
    };

    xhr.send();
}
// -----------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// PERSISTENT SIDEBAR DRAWER (PERSISTS ACROSS PAGES & RELOADS)
// -----------------------------------------------------------------

// 1. Restore the sidebar state on page load without trigger animation
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.side');
    const backdrop = document.querySelector('.sidebar-backdrop');

    // Read saved state ('true' or 'false')
    const isSidebarOpen = localStorage.getItem('sidebarOpen') === 'true';

    if (sidebar && isSidebarOpen) {
        // Temporarily disable CSS transitions to prevent sliding animation on page load
        sidebar.style.transition = 'none';
        if (backdrop) backdrop.style.transition = 'none';

        // Apply open state
        sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');

        // Restore CSS transitions for smooth manual clicks
        setTimeout(function () {
            sidebar.style.transition = '';
            if (backdrop) backdrop.style.transition = '';
        }, 50);
    }
});

// 2. Toggle sidebar state & save state to localStorage
window.toggleMenu = function () {
    const sidebar = document.querySelector('.side');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (sidebar) {
        const isOpen = sidebar.classList.toggle('open');
        
        if (backdrop) {
            backdrop.classList.toggle('active');
        }

        // Save 'true' if open, 'false' if closed
        localStorage.setItem('sidebarOpen', isOpen);
    }
};

// -----------------------------------------------------------------
// Job Dropdown
// -----------------------------------------------------------------
function checkLink(docName) {
            console.log('Navigating to:', docName);
            closeJobsDropdown();
        }

        function toggleJobsDropdown(event) {
            event.stopPropagation();
            const menu = document.getElementById('jobsDropdownMenu');
            const btn = document.getElementById('jobsBtn');
            const isOpen = menu.classList.contains('show');

            if (isOpen) {
                closeJobsDropdown();
            } else {
                menu.classList.add('show');
                btn.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        }

        function closeJobsDropdown() {
            const menu = document.getElementById('jobsDropdownMenu');
            const btn = document.getElementById('jobsBtn');
            if (menu) menu.classList.remove('show');
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }

        // Close when clicking anywhere outside
        window.addEventListener('click', function (event) {
            const menu = document.getElementById('jobsDropdownMenu');
            const btn = document.getElementById('jobsBtn');
            if (menu && !menu.contains(event.target) && event.target !== btn) {
                closeJobsDropdown();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeJobsDropdown();
            }
        });

// -------------------------------------------------------------
// INTERACTIVE MAP (PAN & ZOOM CONTROLS)
// -------------------------------------------------------------
function initInteractiveMap() {
    const viewport = document.getElementById('mapViewport');
    const wrapper = document.getElementById('mapWrapper');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');

    if (!viewport || !wrapper) return;

    let scale = 1;
    let pointX = 0;
    let pointY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const minScale = 0.8;
    const maxScale = 6;

    function updateTransform(animate = false) {
        if (animate) {
            wrapper.style.transition = 'transform 0.25s cubic-bezier(0.2, 0, 0.2, 1)';
        } else {
            wrapper.style.transition = 'none';
        }
        wrapper.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    function zoom(deltaFactor, zoomCenterX, zoomCenterY) {
        const rect = viewport.getBoundingClientRect();

        // Default to center if coordinates aren't passed (e.g., button clicks)
        const cx = zoomCenterX !== undefined ? zoomCenterX - rect.left : rect.width / 2;
        const cy = zoomCenterY !== undefined ? zoomCenterY - rect.top : rect.height / 2;

        const newScale = Math.min(Math.max(scale * deltaFactor, minScale), maxScale);
        const factor = newScale / scale;

        // Adjust origins so zooming scales towards mouse pointer or center
        pointX = cx - (cx - pointX) * factor;
        pointY = cy - (cy - pointY) * factor;
        scale = newScale;

        updateTransform(true);
    }

    // 1. Mouse Wheel Zooming
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.2 : 0.8;
        zoom(delta, e.clientX, e.clientY);
    }, { passive: false });

    // 2. Mouse Drag Panning
    viewport.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Left-click only
        isPanning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform(false);
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            viewport.style.cursor = 'grab';
        }
    });

    // 3. Mobile Touch Drag & Pinch-to-Zoom
    let startTouchDistance = 0;

    viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isPanning = true;
            startX = e.touches[0].clientX - pointX;
            startY = e.touches[0].clientY - pointY;
        } else if (e.touches.length === 2) {
            isPanning = false;
            startTouchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (isPanning && e.touches.length === 1) {
            pointX = e.touches[0].clientX - startX;
            pointY = e.touches[0].clientY - startY;
            updateTransform(false);
        } else if (e.touches.length === 2) {
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (startTouchDistance > 0) {
                const delta = currentDist / startTouchDistance;
                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                zoom(delta, midX, midY);
                startTouchDistance = currentDist;
            }
        }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
        isPanning = false;
        startTouchDistance = 0;
    });

    // 4. Button Controls
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => zoom(1.3));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => zoom(0.7));
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => {
        scale = 1;
        pointX = 0;
        pointY = 0;
        updateTransform(true);
    })
    if (openTabBtn && mapImage) {
    openTabBtn.addEventListener('click', () => {
        window.open(mapImage.src, '_blank', 'noopener,noreferrer');
    });
};
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveMap);
} else {
    initInteractiveMap();
}