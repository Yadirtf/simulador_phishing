const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 1. Cargar variables de entorno desde .env.local
const envPath = path.join(__dirname, ".env.local");
let env = {};
try {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      env[key] = val;
    }
  });
} catch (e) {
  console.log("No se pudo leer .env.local, usando variables de entorno globales.");
}

// Configurar SMTP (Por defecto intentará usar Mailtrap si está configurado, o Gmail si no)
const smtpUser = env.SMTP_USER || process.env.SMTP_USER;
const smtpPass = env.SMTP_PASS || process.env.SMTP_PASS;

if (!smtpUser || !smtpPass) {
  console.error("❌ ERROR: Define SMTP_USER y SMTP_PASS en .env.local");
  process.exit(1);
}

// Determinar el host (Mailtrap vs Gmail) basándonos en el usuario o proveedor
const isGmail = smtpUser.toLowerCase().includes("gmail.com");

const mailConfig = isGmail
  ? {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    };

console.log(`Configurando transporte SMTP con host: ${mailConfig.host}:${mailConfig.port}`);
const transport = nodemailer.createTransport(mailConfig);

// 2. Simulación del flujo de Recuperación de Contraseña
async function testPasswordRecovery() {
  const userEmail = "usuario.prueba@example.com"; // Email del usuario que solicita la recuperación

  console.log(`\n--- Iniciando simulación de recuperación para: ${userEmail} ---`);

  // a) Generar un token criptográficamente seguro de 32 bytes (64 caracteres hex)
  const resetToken = crypto.randomBytes(32).toString("hex");
  
  // b) Generar la fecha de expiración (ej: 1 hora a partir de ahora)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // c) Para almacenar seguro en Base de Datos (Buena práctica):
  // Se recomienda guardar un hash del token (SHA-256) en lugar del token en texto plano,
  // para evitar comprometer las cuentas si la base de datos es vulnerada.
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  console.log(`[Seguridad] Token generado: ${resetToken}`);
  console.log(`[Seguridad] Hash del token a guardar en DB: ${hashedToken}`);
  console.log(`[Seguridad] Expiración configurada para: ${expiresAt.toISOString()}`);

  // d) Construir la URL de restablecimiento
  const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;

  // e) Diseñar una plantilla de correo profesional para recuperación de contraseña
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablecer contraseña</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f4f7;
          color: #51545e;
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: none;
        }
        .wrapper {
          width: 100%;
          background-color: #f4f4f7;
          padding: 24px 0;
        }
        .container {
          max-width: 570px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e8e5ef;
          border-radius: 8px;
          padding: 45px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        h1 {
          color: #333333;
          font-size: 22px;
          font-weight: bold;
          margin-top: 0;
          text-align: left;
        }
        p {
          font-size: 16px;
          line-height: 1.625;
          color: #51545e;
          margin: 20px 0;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #3869d4;
          border-top: 10px solid #3869d4;
          border-right: 18px solid #3869d4;
          border-bottom: 10px solid #3869d4;
          border-left: 18px solid #3869d4;
          display: inline-block;
          color: #fff;
          text-decoration: none;
          border-radius: 3px;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
          font-size: 15px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #e8e5ef;
          padding-top: 20px;
          font-size: 12px;
          color: #a8aeff;
          text-align: left;
          line-height: 1.5;
        }
        .break-link {
          word-break: break-all;
          color: #3869d4;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <h1>Hola,</h1>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para configurar una nueva contraseña:</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button" target="_blank" style="color: #ffffff;">Restablecer contraseña</a>
          </div>

          <p>Este enlace de restablecimiento de contraseña <strong>expirará en 1 hora</strong> por motivos de seguridad.</p>
          <p>Si no realizaste esta solicitud, puedes ignorar este correo de forma segura; tu contraseña seguirá siendo la misma.</p>
          
          <p>Saludos,<br>El equipo de seguridad de la aplicación.</p>

          <div class="footer">
            <p>Si tienes problemas con el botón de arriba, copia y pega la siguiente URL en tu navegador web:</p>
            <p class="break-link">${resetUrl}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // f) Enviar el correo usando el transporte configurado
  try {
    const info = await transport.sendMail({
      from: `"Soporte de Cuentas" <${smtpUser}>`,
      to: userEmail,
      subject: "Restablecer contraseña de tu cuenta",
      html: emailHtml,
    });

    console.log("✅ ¡Correo de restablecimiento enviado con éxito!");
    console.log("ID del mensaje:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar el correo de recuperación:");
    console.error(error.message || error);
    
    if (error.code === 'ETIMEDOUT') {
      console.log("\n💡 SUGERENCIA: La conexión SMTP falló por tiempo de espera agotado.");
      console.log("Asegúrate de que tu proveedor de internet o firewall no estén bloqueando los puertos 465/587.");
      console.log("Para pruebas locales de desarrollo, considera usar una cuenta de Mailtrap (puerto 2525).");
    }
  }
}

testPasswordRecovery();
