/**
 * Notification Service - Módulo para manejar las notificaciones y mensajes
 */

/**
 * Muestra un mensaje de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, error, info)
 */
export function showMessage(message, type = "info") {
  // Crear el contenedor de mensajes si no existe
  let messageContainer = document.getElementById("message-container")
  if (!messageContainer) {
    messageContainer = document.createElement("div")
    messageContainer.id = "message-container"
    messageContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    `
    document.body.appendChild(messageContainer)
  }

  // Crear el mensaje
  const messageElement = document.createElement("div")
  messageElement.className = `message ${type}`
  messageElement.style.cssText = `
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease forwards;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 280px;
  `

  // Aplicar estilos según el tipo
  switch (type) {
    case "success":
      messageElement.style.background = "linear-gradient(135deg, #28a745, #20c997)"
      break
    case "error":
      messageElement.style.background = "linear-gradient(135deg, #dc3545, #ff6b6b)"
      break
    default:
      messageElement.style.background = "linear-gradient(135deg, #17a2b8, #4a90e2)"
  }

  // Contenido del mensaje
  messageElement.innerHTML = `
    <span>${message}</span>
    <button class="close-message" style="
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;
      padding: 0 0 0 10px;
    ">×</button>
  `

  // Agregar al contenedor
  messageContainer.appendChild(messageElement)

  // Botón para cerrar
  const closeButton = messageElement.querySelector(".close-message")
  closeButton.addEventListener("mouseover", () => {
    closeButton.style.opacity = "1"
  })
  closeButton.addEventListener("mouseout", () => {
    closeButton.style.opacity = "0.8"
  })
  closeButton.addEventListener("click", () => {
    removeMessage(messageElement)
  })

  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    removeMessage(messageElement)
  }, 5000)
}

/**
 * Elimina un mensaje con animación
 * @param {HTMLElement} messageElement - Elemento del mensaje
 */
function removeMessage(messageElement) {
  // Si ya se está eliminando, no hacer nada
  if (messageElement.classList.contains("removing")) return
  
  messageElement.classList.add("removing")
  messageElement.style.animation = "slideOut 0.3s ease forwards"
  
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement)
    }
  }, 300)
}

/**
 * Muestra un diálogo de confirmación
 * @param {string} message - Mensaje de confirmación
 * @returns {Promise<boolean>} - Promesa que se resuelve con true si se confirma
 */
export function showConfirmation(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    `

    const confirmBox = document.createElement("div")
    confirmBox.style.cssText = `
      background: #1e1e1e;
      border-radius: 12px;
      padding: 25px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
      border: 1px solid rgba(59, 130, 246, 0.3);
    `

    confirmBox.innerHTML = `
      <div style="margin-bottom: 20px; font-size: 18px; color: #e0e0e0;">${message}</div>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="confirm-yes" style="
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        ">Sí</button>
        <button id="confirm-no" style="
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.3);
          padding: 10px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        ">No</button>
      </div>
    `

    overlay.appendChild(confirmBox)
    document.body.appendChild(overlay)

    // Event listeners
    const yesButton = document.getElementById("confirm-yes")
    const noButton = document.getElementById("confirm-no")

    yesButton.addEventListener("mouseover", () => {
      yesButton.style.transform = "translateY(-2px)"
      yesButton.style.boxShadow = "0 5px 15px rgba(59, 130, 246, 0.4)"
    })

    yesButton.addEventListener("mouseout", () => {
      yesButton.style.transform = "translateY(0)"
      yesButton.style.boxShadow = "none"
    })

    noButton.addEventListener("mouseover", () => {
      noButton.style.transform = "translateY(-2px)"
      noButton.style.boxShadow = "0 5px 15px rgba(255, 107, 107, 0.2)"
    })

    noButton.addEventListener("mouseout", () => {
      noButton.style.transform = "translateY(0)"
      noButton.style.boxShadow = "none"
    })

    yesButton.addEventListener("click", () => {
      document.body.removeChild(overlay)
      resolve(true)
    })

    noButton.addEventListener("click", () => {
      document.body.removeChild(overlay)
      resolve(false)
    })
  })
}
