/**
 * API Service - Módulo para manejar todas las llamadas a la API
 */

/**
 * Obtiene las imágenes del servidor según los filtros aplicados
 * @param {string} category - Categoría seleccionada
 * @returns {Promise<Array>} - Array de objetos de imagen
 */
export async function fetchImages(category) {
  let url = "/upload/list"
  const params = new URLSearchParams()

  // Añadir parámetros según la categoría
  if (category === "projects") {
    params.append("category", "projects")
  } else if (category === "profile") {
    params.append("category", "profile")
  }
  // Para todas las categorías, no añadir parámetros

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  console.log(`Solicitando URL: ${url}`)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    let images = await response.json()
    console.log(`Imágenes recibidas del servidor: ${images.length}`)

    // Filtrado adicional en el cliente para asegurar que solo se muestren las imágenes correctas
    if (category === "projects") {
      // Solo mostrar imágenes de projects/fullstack
      images = images.filter((img) => img.category === "projects" && img.type === "fullstack")
    } else if (category === "profile") {
      // Solo mostrar imágenes de profile
      images = images.filter((img) => img.category === "profile")
    } else {
      // Para "Todas las categorías", mostrar imágenes de profile y projects/fullstack
      images = images.filter(
        (img) => img.category === "profile" || (img.category === "projects" && img.type === "fullstack"),
      )
    }

    console.log(`Filtrado: Categoría=${category || "todas"}, Imágenes=${images.length}`)

    return images
  } catch (error) {
    console.error("Error al cargar imágenes:", error)
    return []
  }
}

/**
 * Elimina una imagen del servidor
 * @param {string} imageName - Nombre de la imagen a eliminar
 * @param {string} imageUrl - URL de la imagen a eliminar
 * @returns {Promise<boolean>} - True si se eliminó correctamente
 */
export async function deleteImage(imageName, imageUrl) {
  try {
    // Extraer la categoría y el tipo de la URL de la imagen
    // Formato esperado de imageUrl: /images/[category]/[type]/[filename]
    // o /images/[category]/[filename] si no hay tipo
    const urlParts = imageUrl.split('/');
    
    // Eliminar elementos vacíos
    const parts = urlParts.filter(part => part);
    
    // Obtener categoría, tipo y nombre de archivo
    let category, type, filename;
    
    if (parts.length >= 3) {
      // El primer elemento es "images"
      category = parts[1]; // El segundo elemento es la categoría
      
      if (parts.length >= 4) {
        // Si hay 4 o más partes, hay un tipo
        type = parts[2];
        filename = parts[3]; // El nombre del archivo
      } else {
        // Si hay 3 partes, no hay tipo
        type = '';
        filename = parts[2]; // El nombre del archivo
      }
    }
    
    // Si no se pudo extraer la información necesaria, usar valores por defecto
    if (!category || !filename) {
      console.error("No se pudo extraer la información de la URL:", imageUrl);
      return false;
    }
    
    const response = await fetch("/upload/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        category,
        type,
        filename
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return false;
  }
}
