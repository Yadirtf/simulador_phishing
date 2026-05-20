const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Leer .env.local de forma simple
const envPath = path.join(__dirname, '.env.local');
let env = {};
try {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      env[key] = val;
    }
  });
} catch (e) {
  console.log("No se pudo leer .env.local, usando valores por defecto.");
}

const user = env.SMTP_USER || 'clienteswta@gmail.com';
const pass = env.SMTP_PASS || 'jrik spei nshu nlcs';

console.log('Probando conexión SMTP con:', user);

async function testGmail() {
  const configs = [
    {
      name: "Puerto 465 (SSL/TLS con rejectUnauthorized: false)",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    },
    {
      name: "Puerto 587 (STARTTLS con rejectUnauthorized: false)",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    },
    {
      name: "Puerto 465 (SSL/TLS estándar)",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass }
    },
    {
      name: "Puerto 587 (STARTTLS estándar)",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass }
    }
  ];

  for (const config of configs) {
    console.log(`\n--- Probando configuración: ${config.name} ---`);
    const transporter = nodemailer.createTransport(config);
    try {
      await transporter.verify();
      console.log(`✅ ¡Conexión exitosa con ${config.name}!`);
      
      // Intentar enviar un correo de prueba
      const info = await transporter.sendMail({
        from: `"${user}" <${user}>`,
        to: user,
        subject: "Prueba de conexión nodemailer",
        text: "La prueba de conexión ha sido exitosa."
      });
      console.log("✅ Correo enviado con éxito:", info.messageId);
      return;
    } catch (err) {
      console.error(`❌ Falló la configuración ${config.name}:`);
      console.error(err.message || err);
    }
  }
}

testGmail();
