/**
 * Gallery Controller - Módulo principal que integra todos los componentes
 */
import GalleryManager from './gallery-manager.js';
import * as ApiService from './api-service.js';
import * as GalleryRenderer from './gallery-renderer.js';
import * as NotificationService from './notification-service.js';
import * as UIHandlers from './ui-handlers.js';

/**
 * Clase que extiende GalleryManager e implementa todos los métodos necesarios
 */
class GalleryController extends GalleryManager {
  constructor() {
    super();
    this.initializeGallery();
  }

  /**
   * Inicializa la galería con todos los componentes
   */
  initializeGallery() {
    console.log("Inicializando controlador de galería...");
    
    // Inicializar manejadores de UI
    UIHandlers.initUIHandlers();
    
    // Añadir estilos para animaciones
    this.addAnimationStyles();
  }

  /**
   * Obtiene las imágenes del servidor
   * @returns {Promise<Array>} - Array de objetos de imagen
   */
  async fetchImages() {
    const images = await ApiService.fetchImages(this.currentCategory);
    
    // Actualizar contador de imágenes
    if (images && images.length !== undefined) {
      UIHandlers.updateImageCount(images.length);
    }
    
    return images;
  }

  /**
   * Renderiza la galería de imágenes
   * @param {Array} images - Array de objetos de imagen
   */
  renderGallery(images) {
    // Crear objeto de callbacks para pasar a la función de renderizado
    const callbacks = {
      deleteImage: (img, container) => this.deleteImage(img, container),
      viewFullSize: (img) => this.viewImageFullSize(img)
    };
    
    // Llamar a la función de renderizado
    GalleryRenderer.renderGallery(images, callbacks, (message, type) => this.showMessage(message, type));
    
    // Actualizar contador de imágenes
    UIHandlers.updateImageCount(images.length);
  }

  /**
   * Muestra una imagen en tamaño completo
   * @param {Object} img - Objeto de imagen
   */
  viewImageFullSize(img) {
    GalleryRenderer.viewImageFullSize(img);
  }

  /**
   * Elimina una imagen
   * @param {Object} img - Objeto de imagen
   * @param {HTMLElement} container - Contenedor de la imagen
   */
  async deleteImage(img, container) {
    try {
      // Mostrar confirmación
      const confirmed = await NotificationService.showConfirmation(`¿Estás seguro de que deseas eliminar la imagen "${img.name}"?`);
      
      if (!confirmed) return;
      
      // Eliminar la imagen
      const success = await ApiService.deleteImage(img.name, img.url);
      
      if (success) {
        // Eliminar del DOM
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
          
          // Actualizar contador de imágenes
          const galleryGrid = document.getElementById('gallery-grid');
          if (galleryGrid) {
            const imageItems = galleryGrid.querySelectorAll('.image-item');
            UIHandlers.updateImageCount(imageItems.length);
          }
        }
        
        // Mostrar mensaje de éxito
        this.showMessage(`✅ Imagen "${img.name}" eliminada correctamente`, "success");
      } else {
        this.showMessage("❌ Error al eliminar la imagen", "error");
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      this.showMessage("❌ Error al eliminar la imagen", "error");
    }
  }

  /**
   * Muestra un mensaje
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje (success, error, info)
   */
  showMessage(message, type = "info") {
    NotificationService.showMessage(message, type);
  }

  /**
   * Añade estilos CSS para animaciones
   */
  addAnimationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// Inicializar la galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.galleryApp = new GalleryController();
});

export default GalleryController;
