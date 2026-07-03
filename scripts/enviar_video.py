import os
import asyncio
from telethon import TelegramClient
from telethon.errors import FloodWaitError
from telethon.tl.functions.contacts import ImportContactsRequest
from telethon.tl.types import InputPhoneContact

# --- Credenciales ---
API_ID = "Ingresar API"
API_HASH = "Ingresar API Hash"
SESSION_NAME = "sesion"

async def main():
    client = TelegramClient(SESSION_NAME, API_ID, API_HASH)
    await client.start()
    print("Sesión iniciada correctamente.\n")

    # Pedir datos
    numero = input("Ingresa el número (+51...), @usuario o 'me': ").strip()
    ruta_video = input("Ruta del video (ej. video.mp4): ").strip()
    texto = input("Texto del video (caption): ").strip()

    if not os.path.exists(ruta_video):
        print("Error: No encuentro el archivo de video.")
        await client.disconnect()
        return

    print("Procesando contacto...")
    destino = numero
    
    # Si es un número de teléfono, lo importamos a la mala
    if not numero.startswith("@") and numero.lower() != "me":
        try:
            contacto = InputPhoneContact(
                client_id=0, 
                phone=numero, 
                first_name="Destino", 
                last_name="Ulima"
            )
            resultado = await client(ImportContactsRequest([contacto]))
            if not resultado.users:
                print("No se pudo encontrar el número en Telegram.")
                await client.disconnect()
                return
            destino = resultado.users[0]
        except Exception as e:
            print(f"Hubo un problema con el contacto: {e}")
            await client.disconnect()
            return

    # Bucle para manejar el FloodWait (más común en estudiantes que la recursividad)
    enviado = False
    while not enviado:
        try:
            # Mandamos el saludo primero
            await client.send_message(destino, "¡Hola comunidad Ulima!")
            
            # Mandamos el video (Telethon hace lo mejor posible con las dimensiones por defecto)
            print("Subiendo video, espera un momento...")
            await client.send_file(
                destino,
                ruta_video,
                caption=texto,
                supports_streaming=True
            )
            print("¡Listo! Mensaje y video enviados.")
            enviado = True

        except FloodWaitError as e:
            print(f"\nUy, Telegram nos bloqueó por spam. Esperando {e.seconds} segundos...")
            await asyncio.sleep(e.seconds + 2)
        except Exception as e:
            print(f"Error inesperado al enviar: {e}")
            break

    await client.disconnect()

if __name__ == "__main__":
    # Arrancamos el script
    asyncio.run(main())