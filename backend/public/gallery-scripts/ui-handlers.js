/**
 * UI Handlers - Módulo para manejar eventos de UI específicos
 */

/**
 * Inicializa los manejadores de eventos de UI
 */
export function initUIHandlers() {
  // Configurar el botón de volver
  setupBackButton();
  
  // Configurar contador de imágenes
  setupImageCounter();
}

/**
 * Configura el botón de volver
 */
function setupBackButton() {
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Redirigir a la página principal
      window.location.href = '/';
    });
  }
}

/**
 * Actualiza el contador de imágenes
 * @param {number} count - Número de imágenes
 */
export function updateImageCount(count) {
  const countElement = document.getElementById('images-count');
  if (countElement) {
    countElement.textContent = count === 1 ? '1 imagen' : `${count} imágenes`;
  }
}

/**
 * Configura el observador del contador de imágenes
 */
function setupImageCounter() {
  // Crear un MutationObserver para detectar cambios en la galería
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    const observer = new MutationObserver((mutations) => {
      // Contar las imágenes (excluyendo el mensaje de "no hay imágenes")
      const imageItems = galleryGrid.querySelectorAll('.image-item');
      updateImageCount(imageItems.length);
    });
    
    // Configurar el observador
    observer.observe(galleryGrid, { 
      childList: true, 
      subtree: true 
    });
  }
}
