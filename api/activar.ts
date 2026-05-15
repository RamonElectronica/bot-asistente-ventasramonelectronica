import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.TELEGRAM_TOKEN;
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!token || !webhookUrl) {
    return res.status(500).json({ 
      error: "Variables faltantes", 
      config: { hasToken: !!token, hasUrl: !!webhookUrl } 
    });
  }

  // URL DE PRODUCCIÓN CORREGIDA
  const url = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json({
      mensaje: "Sincronización comercial ejecutada",
      url_registrada: webhookUrl,
      respuesta_telegram: data
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Error de conexión", 
      detalle: error instanceof Error ? error.message : String(error) 
    });
  }
}
