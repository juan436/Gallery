/**
 * Punto de entrada principal para la galería de imágenes
 * Este archivo importa y exporta todos los módulos necesarios
 */

// Importar todos los módulos
import GalleryManager from './gallery-manager.js';
import GalleryController from './gallery-controller.js';
import * as ApiService from './api-service.js';
import * as GalleryRenderer from './gallery-renderer.js';
import * as NotificationService from './notification-service.js';
import * as UIHandlers from './ui-handlers.js';

// Exportar todos los módulos para uso externo
export {
  GalleryManager,
  GalleryController,
  ApiService,
  GalleryRenderer,
  NotificationService,
  UIHandlers
};

// Inicializar la galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando galería de imágenes...');
  
  // Crear una instancia del controlador de la galería
  window.galleryApp = new GalleryController();
});
