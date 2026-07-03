# Emulación de Adversarios: Phishing, Exfiltración y Bypass de 2FA

Proyecto del curso de Ciberseguridad — **Grupo 2** (Universidad de Lima).
Simulación integral de una cadena de ataque de ingeniería social en un **entorno de laboratorio virtualizado y aislado**, con fines estrictamente académicos y defensivos.

> **AVISO DE USO RESPONSABLE**
> Este repositorio contiene copias funcionales de portales de inicio de sesión y scripts que capturan credenciales. Su uso está restringido a un **laboratorio aislado y con datos sintéticos**. Queda prohibido su uso contra sistemas o personas reales. Mantén este repositorio **privado** y compártelo únicamente con el docente y el equipo. Al terminar la evaluación, desactiva la infraestructura y elimina los datos capturados.

---

## Integrantes

- Barreto Ibrahim Reaid Yusef — 20224518
- Kou Acosta Nicolas — 20231550
- Lazaro Torres Sebastian — 20234645
- Luna Carranza Dorian Sebastian — 20231682

**Asesor:** Miguel Angel Valencia Amado

---

## Descripción

El proyecto reproduce, de extremo a extremo, la cadena de ataque de un adversario para comprender cómo se encadenan las técnicas ofensivas y derivar contramedidas. Se implementaron cinco casos de uso: recolección de credenciales (phishing de RR.HH.), quishing (código QR), ejecución de código y exfiltración con macros + MITRE Caldera, actualización falsa de 2FA (Soporte IT) y suplantación con IA (deepfake) para evadir el segundo factor.

## Entorno

- **Máquina atacante:** Kali Linux (10.211.55.9) — Gophish, Nexphisher, servidor Flask, MITRE Caldera, servidor Node del portal clonado.
- **Máquina víctima:** Windows (10.211.55.10) — hMailServer/MailHog, Microsoft Office, archivo hosts modificado.
- **Red:** interna aislada (host-only) 10.211.55.0/24.

## Estructura del repositorio

```
.
├── README.md
├── .gitignore
├── portal-clonado/
│   ├── login-ulima.html      # Clon del login institucional (2 pantallas: login + código 2FA)
│   └── server.js             # Servidor Node (puerto 3000), guarda en datos.json
├── flask/
│   └── reporte_server.py     # Endpoint /reporte/<dni> que entrega el agente (Caso de exfiltración)
├── correos/                  # Plantillas de correo usadas en Gophish
│   ├── comunicado_rrhh.html  # Caso 1 (actualización obligatoria de credenciales)
│   ├── correo_nomina.html    # Caso de nómina (Excel con macros)
│   ├── correo_quishing.html  # Caso QR (quishing)
│   └── correo_soporte_it.html# Caso Soporte IT (actualización de 2FA)
├── scripts/
│   ├── enviar_video.py       # Envío del deepfake por la API de Telegram
│   └── macro_excel.bas       # Macro VBA (exportada como texto)
└── docs/
    └── evidencias/           # Capturas y logs (opcional)
```

## Requisitos

- **Node.js 18+** (el servidor no usa dependencias externas).
- **Python 3.10+** (para el servidor Flask y el script de Telegram).
- **Kali Linux** o una VM Debian aislada.
- Herramientas externas: **Gophish**, **Nexphisher**, **MITRE Caldera**, **cloudflared** (para el túnel).

## Cómo ejecutar

### 1) Portal clonado (Node)

```
cd portal-clonado
node server.js
# Abrir en el navegador: http://localhost:3000
```

Los datos ingresados se guardan en `datos.json` (no se sube al repositorio).

Para exponerlo a Internet en el laboratorio (opcional):

```
cloudflared tunnel --url http://localhost:3000
```

### 2) Servidor Flask (entrega del agente)

```
cd flask
python3 reporte_server.py
# Escucha en http://0.0.0.0:5000  (endpoint /reporte/<dni>)
```

### 3) Envío del deepfake por Telegram

```
cd scripts
python3 enviar_video.py
```

## Rutina al reiniciar

Levantar dos terminales: una con el servidor (`node server.js`) y otra con el túnel (`cloudflared tunnel --url http://localhost:3000`), que genera una URL pública nueva en cada ejecución.

## Datos y seguridad

- No se versionan datos capturados (`datos.json`), logs (`*.log`) ni el archivo `.xlsm` armado (ver `.gitignore`).
- Todas las identidades, credenciales y números telefónicos usados son **sintéticos**.
- Se recomienda mantener el antivirus/EDR activo en entornos reales; en el laboratorio se desactivó temporalmente porque el agente nativo de Caldera tiene una firma conocida (esto mismo confirma el valor del control).

## Licencia y alcance

Uso académico. No se autoriza el empleo de este material fuera del entorno de laboratorio ni contra sistemas o personas reales.
