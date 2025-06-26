class ImageUploader {
  constructor() {
    this.form = document.getElementById("upload-form")
    this.categorySelect = document.getElementById("category")
    this.fileInput = document.getElementById("image")
    this.filePreview = document.getElementById("file-preview")
    this.submitBtn = document.querySelector(".submit-btn")
    this.resultMessage = document.getElementById("result-message")

    this.init()
  }

  init() {
    // Event listeners principales
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e))
    document.getElementById("show-images").addEventListener("click", () => this.openImagesModal())

    // Inicializar el botón de guías de imágenes
    const guidelinesToggle = document.getElementById("toggle-guidelines")
    const guidelinesContent = document.getElementById("guidelines-content")

    if (guidelinesToggle && guidelinesContent) {
      guidelinesToggle.addEventListener("click", () => {
        guidelinesContent.classList.toggle("show")
        const guidelinesText = guidelinesToggle.querySelector(".guidelines-text")
        guidelinesText.textContent = guidelinesContent.classList.contains("show") 
          ? "Ocultar recomendaciones de imágenes" 
          : "Mostrar recomendaciones de imágenes"
      })
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    // Mostrar vista previa
    this.filePreview.innerHTML = ""
    this.filePreview.classList.add("show")

    const img = document.createElement("img")
    img.src = URL.createObjectURL(file)
    img.onload = () => URL.revokeObjectURL(img.src)
    img.alt = file.name

    const fileInfo = document.createElement("div")
    fileInfo.className = "file-info"
    fileInfo.innerHTML = `
      <span class="file-name">${file.name}</span>
      <span class="file-size">${this.formatFileSize(file.size)}</span>
    `

    this.filePreview.appendChild(img)
    this.filePreview.appendChild(fileInfo)

    // Añadir botón para eliminar la selección
    const removeBtn = document.createElement("button")
    removeBtn.type = "button"
    removeBtn.className = "remove-file"
    removeBtn.innerHTML = "×"
    removeBtn.addEventListener("click", () => this.removeFileSelection())

    this.filePreview.appendChild(removeBtn)
  }

  removeFileSelection() {
    this.fileInput.value = ""
    this.filePreview.innerHTML = ""
    this.filePreview.classList.remove("show")
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  async handleSubmit(e) {
    e.preventDefault()
    
    const formData = new FormData(this.form)
    const category = formData.get("category")
    
    // Si la categoría es "projects", añadir automáticamente el tipo "fullstack"
    if (category === "projects") {
      formData.set("category", "projects/fullstack")
    }

    // Mostrar indicador de carga
    this.submitBtn.classList.add("loading")
    this.submitBtn.disabled = true
    
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        this.showMessage("Imagen subida correctamente", "success")
        this.form.reset()
        this.removeFileSelection()
      } else {
        this.showMessage(result.error || "Error al subir la imagen", "error")
      }
    } catch (error) {
      console.error("Error:", error)
      this.showMessage("Error de conexión", "error")
    } finally {
      this.submitBtn.classList.remove("loading")
      this.submitBtn.disabled = false
    }
  }

  showMessage(message, type) {
    if (!this.resultMessage) return
    
    this.resultMessage.textContent = message
    this.resultMessage.className = `message ${type}`
    this.resultMessage.style.display = "block"
    
    // Auto ocultar después de 5 segundos
    setTimeout(() => {
      this.resultMessage.style.display = "none"
    }, 5000)
  }

  openImagesModal() {
    // Redireccionar a la página de galería
    window.location.href = "gallery.html";
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new ImageUploader()
})
