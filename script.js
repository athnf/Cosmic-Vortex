
// Function untuk menyesuaikan tata letak saat ukuran layar berubah
function adjustLayout() {
    const container = document.querySelector('.container');
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 768) {
        container.style.padding = '0 20px';
    } else {
        container.style.padding = '0';
    }
}

// Panggil adjustLayout saat halaman dimuat
window.addEventListener('DOMContentLoaded', adjustLayout);

// Panggil adjustLayout saat ukuran layar berubah
window.addEventListener('resize', adjustLayout);