export function getNetflixEmailTemplate(campaignId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://simulador-phishing-nu.vercel.app/";
  const clickUrl = `${baseUrl}/api/track-click?id=${campaignId}`;
  const openUrl = `${baseUrl}/api/track-open?id=${campaignId}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Valida tu correo electrónico</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .header {
      background-color: #000000;
      padding: 20px;
      text-align: left;
    }

    .logo {
      height: 35px;
      display: block;
    }

    .content {
      padding: 40px 30px;
      color: #333333;
    }

    .headline {
      font-size: 26px;
      font-weight: bold;
      color: #222222;
      margin-top: 0;
      margin-bottom: 20px;
    }

    .text {
      font-size: 16px;
      line-height: 1.6;
      color: #555555;
      margin-bottom: 30px;
    }

    .button-container {
      text-align: center;
      margin-bottom: 40px;
    }

    .btn {
      display: inline-block;
      background-color: #E50914;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 30px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .footer {
      background-color: #f3f3f3;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #999999;
      line-height: 1.5;
      border-top: 1px solid #e5e5e5;
    }

    .footer a {
      color: #999999;
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <img 
        src="data:image/png;base64,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" 
        alt="Netflix" 
        class="logo"
      >
    </div>

    <div class="content">
      <h1 class="headline">Valida tu correo electrónico</h1>

      <p class="text">
        Hola,
      </p>

      <p class="text">
        Para continuar utilizando tu cuenta, necesitamos validar tu correo electrónico.
      </p>

      <div class="button-container">
        <a href="${clickUrl}" class="btn">
          VALIDAR CORREO
        </a>
      </div>

      <p class="text" style="font-size: 14px; color: #8c8c8c;">
        Si no realizas esta validación, algunas funciones de tu cuenta podrían verse limitadas temporalmente.
      </p>
    </div>

    <div class="footer">
      <p>
        Este mensaje fue enviado a tu correo electrónico porque estás suscrito a Netflix.
      </p>

      <p>
        Netflix Servicios de Transmisión España, S.L.
      </p>

      <p>
        <a href="#">Privacidad</a> |
        <a href="#">Términos de uso</a> |
        <a href="#">Centro de ayuda</a>
      </p>
    </div>

  </div>

  <!-- Pixel de seguimiento -->
  <img 
    src="${openUrl}" 
    width="1" 
    height="1" 
    alt="" 
    style="display:none; width:1px; height:1px;"
  />
</body>
</html>
  `;
}