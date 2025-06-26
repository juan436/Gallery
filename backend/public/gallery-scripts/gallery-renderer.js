// Variable global para la URL del servidor de imágenes
let IMAGE_SERVER_URL = '';

// Función para cargar la configuración desde el backend
async function loadConfig() {
  try {
    const res = await fetch('/public-config');
    if (res.ok) {
      const config = await res.json();
      IMAGE_SERVER_URL = config.IMAGE_SERVER_URL || IMAGE_SERVER_URL;
      console.log('Configuración cargada:', IMAGE_SERVER_URL);
    } else {
      console.warn('No se pudo cargar la configuración, usando valor por defecto');
    }
  } catch (error) {
    console.error('Error al cargar la configuración:', error);
  }
}

// Cargar la configuración al inicio
loadConfig();

/**
 * Gallery Renderer - Módulo para manejar el renderizado de la galería
 */

/**
 * Renderiza la galería de imágenes
 * @param {Array} images - Array de objetos de imagen
 * @param {Object} callbacks - Objeto con callbacks para eventos (deleteImage, viewFullSize)
 * @param {Function} showMessage - Función para mostrar mensajes
 */
export function renderGallery(images, callbacks, showMessage) {
  const gallery = document.getElementById("gallery-grid")
  gallery.innerHTML = ""

  // Si no hay imágenes, mostrar mensaje
  if (images.length === 0) {
    const noImagesMessage = document.createElement("div")
    noImagesMessage.className = "no-images-message"
    noImagesMessage.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📷</div>
        <h3>No hay imágenes</h3>
        <p>No se encontraron imágenes para los filtros seleccionados.</p>
      </div>
    `
    gallery.appendChild(noImagesMessage)
    return
  }

  // Renderizar las imágenes
  images.forEach((img) => {
    const container = document.createElement("div")
    container.className = "image-item"
    container.dataset.id = img.name
    container.dataset.category = img.category
    container.dataset.type = img.type || ""

    const image = document.createElement("img")
    image.src = img.url
    image.alt = img.name
    image.loading = "lazy"

    // Vista completa al hacer clic
    image.addEventListener("click", () => callbacks.viewFullSize(img))

    const infoDiv = document.createElement("div")
    infoDiv.className = "image-info"

    const nameDiv = document.createElement("div")
    nameDiv.className = "image-name"
    nameDiv.textContent = img.name

    const metaDiv = document.createElement("div")
    metaDiv.className = "image-meta"
    
    // Simplificar la visualización de metadatos
    let categoryLabel = img.category === "profile" ? "👤 Perfil" : "💼 Proyectos"
    metaDiv.innerHTML = `<span class="category-badge">${categoryLabel}</span>`

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "🗑️ Eliminar"
    deleteBtn.className = "delete-btn"
    deleteBtn.onclick = (e) => {
      e.stopPropagation()
      callbacks.deleteImage(img, container)
    }
    
    // Botón para copiar URL - implementación mejorada
    const copyBtn = document.createElement("button")
    copyBtn.textContent = "📋 Copiar URL"
    copyBtn.className = "copy-btn"
    copyBtn.type = "button"
    
    // Crear la URL absoluta y almacenarla como atributo data
    const relativePath = img.url.replace('/images/', '')
    const absoluteUrl = `${IMAGE_SERVER_URL}/images/${relativePath}`;
    copyBtn.dataset.imageUrl = absoluteUrl
    
    // Implementar método robusto para copiar al portapapeles
    copyBtn.onclick = function(e) {
      e.stopPropagation()
      
      const url = this.dataset.imageUrl
      
      // Método principal: usar textarea temporal
      try {
        const textarea = document.createElement("textarea")
        textarea.value = url
        textarea.style.position = "fixed"
        textarea.style.left = "-999999px"
        textarea.style.top = "-999999px"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        
        const successful = document.execCommand("copy")
        document.body.removeChild(textarea)
        
        if (successful) {
          showMessage(`✅ URL copiada`, "success")
          return
        }
      } catch (err) {
        console.error("Error con el método principal de copia:", err)
      }
      
      // Método de respaldo: Clipboard API
      try {
        navigator.clipboard.writeText(url)
          .then(() => {
            showMessage(`✅ URL copiada`, "success")
          })
          .catch(err => {
            console.error("Error con Clipboard API:", err)
            // Último método de respaldo: mostrar prompt
            window.prompt("Copiar al portapapeles: Ctrl+C, Enter", url)
            showMessage("✅ URL lista para copiar", "success")
          })
      } catch (err) {
        console.error("Error general al copiar:", err)
        // Último método de respaldo: mostrar prompt
        window.prompt("Copiar al portapapeles: Ctrl+C, Enter", url)
        showMessage("✅ URL lista para copiar", "success")
      }
    }

    infoDiv.appendChild(nameDiv)
    infoDiv.appendChild(metaDiv)

    container.appendChild(image)
    container.appendChild(infoDiv)
    container.appendChild(deleteBtn)
    container.appendChild(copyBtn)
    gallery.appendChild(container)
  })
}

/**
 * Muestra una imagen en tamaño completo
 * @param {Object} img - Objeto de imagen
 */
export function viewImageFullSize(img) {
  const overlay = document.createElement("div")
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(15px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  `

  const imageContainer = document.createElement("div")
  imageContainer.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    overflow: hidden;
  `

  const fullImage = document.createElement("img")
  fullImage.src = img.url
  fullImage.alt = img.name
  fullImage.style.cssText = `
    max-width: 100%;
    max-height: 90vh;
    display: block;
    object-fit: contain;
  `

  const closeBtn = document.createElement("button")
  closeBtn.innerHTML = "×"
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  `

  closeBtn.addEventListener("mouseover", () => {
    closeBtn.style.background = "rgba(255, 255, 255, 0.4)"
  })

  closeBtn.addEventListener("mouseout", () => {
    closeBtn.style.background = "rgba(255, 255, 255, 0.2)"
  })

  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay)
  })

  imageContainer.appendChild(fullImage)
  imageContainer.appendChild(closeBtn)
  overlay.appendChild(imageContainer)
  document.body.appendChild(overlay)

  // Cerrar al hacer clic fuera de la imagen
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay)
    }
  })
}
