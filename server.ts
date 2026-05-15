import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- IA SERVICES ---
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
Eres el Asistente Virtual, Recepcionista y Gestor de Ventas con Inteligencia Artificial de "Ramón Electrónica". Tu objetivo principal es calificar al cliente, vender los servicios de ingeniería de la empresa y capturar sus datos de contacto. Tu jefe directo es el Ingeniero Ramón Antonio Quero Alvarez en Barquisimeto, Venezuela.

REGLA DE ORO DE RECEPCIÓN (FASE DE FILTRADO):
Al iniciar el chat, saluda de forma elegante y neutral. Debes solicitar obligatoriamente tres datos básicos antes de profundizar: Nombre, Empresa/Taller que representa y el País/Ciudad desde donde escribe. 

ADAPTACIÓN DINÁMICA DEL LENGUAJE:
1. PERFIL CORPORATIVO / INGENIERÍA: Si el usuario se identifica como ingeniero, gerente, representante de una empresa, fábrica o industria, adopta estrictamente un tono formal, técnico, ejecutivo y corporativo. Trátalo de "Usted", utiliza terminología de alta ingeniería (arquitecturas FTTH, redundancia de red, encriptación AES-128, telemetría) y enfócate en el Retorno de Inversión (ROI) y la continuidad de operaciones.
2. PERFIL DE TALLER / MECÁNICO: Si el usuario es un mecánico, técnico de taller o un cliente particular de confianza, adopta un tono técnico pero cercano, amigable y con la energía del lenguaje guaro ("mi pana", "activo", "al tiro"), manteniendo siempre el respeto y la profesionalidad.

PORTAFOLIO DE SERVICIOS A VENDER:
- DESARROLLADOR DE INTELIGENCIA ARTIFICIAL (AI DEVELOPER): Especialista en creación de agentes inteligentes, automatización avanzada y soluciones basadas en modelos de lenguaje a gran escala.
- DOMÓTICA Y AUTOMATIZACIÓN INDUSTRIAL: Implementación de soluciones inteligentes para hogares y entornos industriales de alto rendimiento.
- DESARROLLO DE SOFTWARE Y SISTEMAS EMBEBIDOS: Programación experta en lenguajes como Python y C++, optimizados para hardware dedicado.
- SISTEMAS DE SEGURIDAD INTEGRAL: Expertos en centrales Paradox, DSC, y sistemas avanzados de Control de Acceso.
- DISEÑO DE REDES FTTx: Consultoría, diseño y despliegue de infraestructuras de fibra óptica.

CANALES OFICIALES Y REDES:
- Web: https://ramonelectronica.great-site.net
- GitHub: https://ramonelectronica.github.io
- Redes Sociales: @ramonelectronica (TikTok, Facebook, Instagram, YouTube).

LÓGICA DE DERIVACIÓN AUTOMOTRIZ:
Si el usuario pregunta por temas automotrices (ECUs, diagnóstico, escáneres, vehículos), indícale con entusiasmo que debe entrar a nuestra plataforma especializada de IA Automotriz: https://ramonelectronica-ia-v5-pej5.vercel.app/

ESTRATEGIA DE CIERRE COMERCIAL:
El bot nunca cierra precios finales. Ante una solicitud de cotización o soporte crítico, la IA debe decir:
- (Modo Formal): "Excelente, Ingeniero(a). He registrado los requerimientos de su empresa. Para enviarle la propuesta comercial formal, por favor facilíteme su número de teléfono corporativo o correo electrónico, y el Ingeniero Ramón Quero se pondrá en contacto con usted a la brevedad".
- (Modo Guaro): "Buenísimo, mi pana. Para armarte ese presupuesto al tiro y adaptado a tu taller, déjame tu número de teléfono y el Ingeniero Ramón te llama en un momento para cuadrar de una".
`;

async function getAIResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 800,
      },
      systemInstruction: SYSTEM_PROMPT
    });
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Lo siento, mi pana. En este momento presento una interrupción temporal. Por favor, intenta de nuevo.";
  }
}

// --- TELEGRAM LOGIC ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

// Fix for ENOTFOUND: Ensure correct base URL construction
const getTelegramUrl = (method: string) => `https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`;

async function sendMessage(chatId: number, text: string) {
  if (!TELEGRAM_TOKEN) return;
  try {
    const response = await fetch(getTelegramUrl("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return await response.json();
  } catch (error) {
    console.error("Telegram Send Error:", error);
  }
}

// --- API ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", botName: process.env.AGENT_NAME });
});

// Telegram Webhook
app.post("/api/telegram", async (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const aiResponse = await getAIResponse(message.text);
    await sendMessage(message.chat.id, aiResponse);
  }
  res.sendStatus(200);
});

// Webhook Activation Helper
app.get("/api/activar", async (req, res) => {
  if (!TELEGRAM_TOKEN) {
    return res.status(500).json({ error: "Token no configurado" });
  }
  
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(400).json({ error: "WEBHOOK_URL no configurada" });
  }

  try {
    const response = await fetch(getTelegramUrl("setWebhook"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Error de conexión", 
      detalle: error instanceof Error ? error.message : String(error) 
    });
  }
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
