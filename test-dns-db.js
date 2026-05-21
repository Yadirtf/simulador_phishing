const dns = require("dns");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

// Cargar MONGODB_URI desde .env.local si existe
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
  // Ignorar si no existe
}

const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI no está definido en .env.local o variables de entorno.");
  process.exit(1);
}

console.log("=== INICIANDO DIAGNÓSTICO DE RED Y CONEXIÓN ===");

// 1. Probar conectividad general resolviendo google.com
dns.lookup("google.com", (err, address, family) => {
  if (err) {
    console.error("❌ ERROR: No se pudo resolver google.com. ¿Estás conectado a internet?", err.message);
  } else {
    console.log("✅ INTERNET OK: google.com resolvió a:", address);
  }

  // 2. Probar resolución del host de MongoDB Atlas
  dns.lookup("mio.nwi2k2d.mongodb.net", (err2, address2) => {
    if (err2) {
      console.log("⚠️ dns.lookup a mio.nwi2k2d.mongodb.net falló (normal para mongodb+srv):", err2.message);
    } else {
      console.log("✅ Host principal de MongoDB resolvió a:", address2);
    }

    // 3. Resolver registro SRV (_mongodb._tcp.mio.nwi2k2d.mongodb.net)
    dns.resolveSrv("_mongodb._tcp.mio.nwi2k2d.mongodb.net", (errSrv, addresses) => {
      if (errSrv) {
        console.error("❌ ERROR DNS SRV: No se pudo resolver el registro SRV de MongoDB Atlas.", errSrv.message);
        console.log("💡 Esto suele significar que los servidores DNS de tu red móvil bloquean registros SRV. Prueba cambiando los DNS a 8.8.8.8.");
      } else {
        console.log("✅ DNS SRV OK: Registros encontrados:", addresses);
      }

      // 4. Intentar conectar con Mongoose
      console.log("\nIntentando establecer conexión con MongoDB Atlas...");
      mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
          console.log("✅ CONEXIÓN EXITOSA: Te has conectado correctamente a MongoDB Atlas.");
          process.exit(0);
        })
        .catch((dbErr) => {
          console.error("❌ CONEXIÓN FALLIDA a MongoDB Atlas:", dbErr.message || dbErr);
          process.exit(1);
        });
    });
  });
});
