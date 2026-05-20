export function getNetflixEmailTemplate(campaignId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
        src="https://assets.nflxext.com/us/email/logo/redLogo.png" 
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