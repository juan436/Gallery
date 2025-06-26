/**
 * GalleryManager - Clase principal para gestionar la galería de imágenes
 * Refactorizado para mejor mantenibilidad
 */
class GalleryManager {
  constructor() {
    this.currentCategory = ""
    this.init()
  }

  /**
   * Inicializa la galería y configura los event listeners
   */
  init() {
    console.log("Inicializando galería...")
    
    // Configurar listeners para filtros
    document.getElementById("category-filter").addEventListener("change", () => this.handleCategoryChange())
    
    // Cargar galería inicial
    this.loadGallery()
  }

  /**
   * Carga la galería con los filtros actuales
   */
  async loadGallery() {
    try {
      const images = await this.fetchImages()
      this.renderGallery(images)
      
      // Actualizar el indicador de filtro
      const filterDisplay = document.getElementById("filter-display")
      if (this.currentCategory === "profile") {
        filterDisplay.textContent = "👤 Perfil"
      } else if (this.currentCategory === "projects") {
        filterDisplay.textContent = "💼 Proyectos"
      } else {
        filterDisplay.textContent = "Todas las categorías"
      }
    } catch (error) {
      console.error("Error al cargar la galería:", error)
      this.showMessage("❌ Error al cargar la galería", "error")
    }
  }

  /**
   * Maneja el cambio de categoría
   */
  handleCategoryChange() {
    const category = document.getElementById("category-filter").value
    this.currentCategory = category
    this.loadGallery()
  }
}

// Exportar la clase para que pueda ser importada por otros módulos
export default GalleryManager;
