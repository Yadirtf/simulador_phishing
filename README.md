# informacion_flujo_para_grupo_de_trabajo.md

# Simulación Académica de Phishing — Proyecto de Ingeniería Social

## Objetivo del Proyecto

Desarrollar una simulación académica y controlada de un ataque de phishing enfocado en Netflix, con el fin de demostrar:

- Cómo funcionan los ataques de ingeniería social.
- Cómo los atacantes manipulan psicológicamente a las víctimas.
- Cómo una página falsa puede capturar credenciales.
- Cómo prevenir este tipo de ataques.

IMPORTANTE:
Este proyecto será completamente local y educativo.
NO se utilizará malware real.
NO se robarán credenciales reales.
NO se desplegará públicamente.

---

# Objetivo de Impacto para la Exposición

La meta NO es hacer un ataque real.

La meta es que el profesor vea:

- Realismo visual.
- Flujo convincente.
- Comprensión técnica.
- Comprensión psicológica.
- Profesionalismo.
- Ética en ciberseguridad.

---

# Tecnologías del Proyecto

## Frontend

- Next.js
- Tailwind CSS

## Backend

- Node.js
- API Routes de Next.js

## Correos

- Nodemailer

## Simulación Profesional

- GoPhish

## Base de Datos

Opciones:
mongodb

---

# Arquitectura General del Proyecto

El proyecto tendrá 3 módulos principales:

## 1. Panel del Atacante

Interfaz profesional donde el “hacker”:

- Configura campañas.
- Ingresa correo víctima.
- Envía correo phishing.
- Visualiza métricas.
- Ve usuarios que cayeron.

IMPORTANTE:
NO hacer estilo película hacker.

NO usar:
- fondo negro total,
- letras verdes,
- terminal real de cuando se envia el correro.

Hacer estilo:
- dashboard moderno,
- SaaS profesional,
- panel administrativo elegante.

Inspiración:
- Stripe Dashboard
- Vercel Dashboard
- Notion Analytics

---

## 2. Correo Phishing

Correo falso simulando ser Netflix.

Objetivo psicológico:
Generar urgencia y miedo.

Ejemplo:
- “Tu método de pago falló”
- “Tu cuenta será suspendida”
- “Verifica tu suscripción”

El correo debe incluir:
- logo,
- diseño profesional,
- botón llamativo,
- mensaje convincente.

---

## 3. Landing Page Falsa

Página similar a Netflix.

Objetivo:
Demostrar cómo el usuario puede caer en phishing visual.

Características:
- misma paleta de colores,
- login parecido,
- responsive,
- UX convincente.

Cuando el usuario ingrese:
- correo,
- contraseña,

Guardar únicamente:
- email,
- contraseña,
- navegador,
- fecha,
- IP.
