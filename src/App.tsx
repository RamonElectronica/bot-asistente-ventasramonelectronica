import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Terminal, 
  Settings, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Network,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { APP_CONFIG } from './constants';

export default function App() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'troubleshoot'>('dashboard');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setStatus('online');
          addLog("Sistema en línea. Conexión establecida con el núcleo de IA.");
        } else {
          setStatus('offline');
          addLog("Error de conexión con el backend.");
        }
      } catch (e) {
        setStatus('offline');
        addLog("No se pudo contactar con el servidor de control.");
      }
    };
    checkHealth();
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Top Navigation / Status Rail */}
      <nav className="border-b border-[#141414] px-6 py-3 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#141414] rounded-sm flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase">{APP_CONFIG.name}</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest leading-none">
              {APP_CONFIG.version} // {APP_CONFIG.developer}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : status === 'loading' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
              Status: {status}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Navigation Items */}
          <div className="lg:col-span-3 space-y-1">
            <p className="text-[10px] font-serif italic mb-4 opacity-50 uppercase tracking-widest pl-3">Módulos del Sistema</p>
            {[
              { id: 'dashboard', label: 'Monitor de Bot', icon: Bot },
              { id: 'logs', label: 'Consola de Red', icon: Terminal },
              { id: 'troubleshoot', label: 'Diagnóstico Webhook', icon: AlertCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-[#141414] text-white' 
                    : 'hover:bg-[#d6d5d1] text-[#141414]/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ArrowRight className={`w-3 h-3 transition-transform ${activeTab === item.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
              </button>
            ))}

            <div className="mt-12 p-4 border border-[#141414]/10 rounded-sm bg-white/20">
              <p className="text-[10px] font-mono leading-relaxed opacity-60">
                PROMPT_SYSTEM: Ramón Electrónica Bot v4.2<br/>
                MODEL: GEMINI-3-FLASH<br/>
                INFRA: VERCEL + NODE.JS
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Hero / Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-tight">
                    <div className="p-8 bg-white border border-[#141414] relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-[10px] font-mono mb-2 opacity-50 uppercase tracking-widest">Configuración Activa</p>
                        <h2 className="text-4xl font-bold mb-4 tracking-tighter">Bot Asistente Ramón Electrónica</h2>
                        <p className="text-sm opacity-70 mb-6 max-w-sm">
                          Interfaz de IA entrenada para ventas automáticas y soporte técnico 24/7.
                        </p>
                        <div className="flex gap-4">
                          <div className="px-3 py-1 bg-[#141414] text-white text-[10px] font-mono uppercase">Node.js 18+</div>
                          <div className="px-3 py-1 bg-[#141414] text-white text-[10px] font-mono uppercase">Gemini SDK</div>
                        </div>
                      </div>
                      <Bot className="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white border border-[#141414] flex flex-col justify-between">
                        <Zap className="w-6 h-6 mb-4 text-amber-500" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50 uppercase">Latencia IA</p>
                          <p className="text-2xl font-bold font-mono">140ms</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white border border-[#141414] flex flex-col justify-between">
                        <MessageSquare className="w-6 h-6 mb-4 text-blue-500" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50 uppercase">Mensajes HOY</p>
                          <p className="text-2xl font-bold font-mono">1,248</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white border border-[#141414] flex flex-col justify-between">
                        <Network className="w-6 h-6 mb-4 text-purple-500" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50 uppercase">Uptime</p>
                          <p className="text-2xl font-bold font-mono">99.9%</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white border border-[#141414] flex flex-col justify-between">
                        <CheckCircle2 className="w-6 h-6 mb-4 text-green-500" />
                        <div>
                          <p className="text-[10px] font-mono opacity-50 uppercase">Conversiones</p>
                          <p className="text-2xl font-bold font-mono">12%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Visualization */}
                  <div className="border border-[#141414] bg-[#141414] text-white p-8 overflow-hidden relative">
                    <h3 className="text-xl font-bold mb-8 uppercase tracking-tight flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      Arquitectura de Flujo de Datos
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                      <div className="text-center group">
                        <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center mb-3 bg-white/10 group-hover:bg-white group-hover:text-[#141414] transition-all duration-300">
                          <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">Telegram API</p>
                      </div>
                      <div className="h-px w-20 bg-white/20 hidden md:block" />
                      <div className="text-center group">
                        <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center mb-3 bg-white/10 group-hover:bg-white group-hover:text-[#141414] transition-all duration-300">
                          <Terminal className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">Vercel Backend</p>
                      </div>
                      <div className="h-px w-20 bg-white/20 hidden md:block" />
                      <div className="text-center group">
                        <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center mb-3 bg-white/10 group-hover:bg-white group-hover:text-[#141414] transition-all duration-300">
                          <BoxIcon className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">Gemini Cloud</p>
                      </div>
                    </div>
                    
                    {/* Background noise texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#141414] text-[#E4E3E0] p-6 rounded-sm font-mono text-xs h-[600px] overflow-y-auto border border-[#E4E3E0]/20 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <span className="uppercase tracking-widest font-bold">Consola de Eventos en Tiempo Real</span>
                  </div>
                  {logs.length === 0 ? (
                    <div className="opacity-40 animate-pulse">Iniciando streaming de logs...</div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, i) => (
                        <div key={i} className="hover:bg-white/5 px-1 py-0.5 border-l border-white/0 hover:border-green-400">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'troubleshoot' && (
                <motion.div
                  key="troubleshoot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <section className="bg-white border-l-4 border-red-500 p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-6 h-6" />
                      Análisis de Error: ENOTFOUND telegram.org{'{token}'}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6 italic opacity-70">
                      Este error es un fallo crítico de arquitectura común al integrar la API de Telegram con Node.js.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold mb-3">La Causa</h4>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                          <code className="text-xs text-red-800 break-all leading-relaxed">
                            {"// Error de concatenación\n"}
                            {"const url = `https://api.telegram.org${token}`;\n"}
                            {"// Resultado: api.telegram.org12345:ABC..."}
                          </code>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#141414]/60">
                          Node.js intenta resolver el host concatenado, lo cual falla en la resolución DNS (getaddrinfo).
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold mb-3">La Corrección</h4>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-sm font-mono text-xs">
                          <code className="text-green-800 break-all leading-relaxed">
                            {"// Estructura de producción\n"}
                            {"const BASE = 'https://api.telegram.org/bot';\n"}
                            {"const url = `${BASE}${token}/setWebhook`;"}
                          </code>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#141414]/60">
                          Es imperativo incluir el prefijo <span className="font-bold underline">/bot</span> antes del token.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="bg-[#141414] text-white p-8">
                    <h3 className="text-lg font-bold mb-6 uppercase tracking-widest">Plan de Acción (Senior Engineer)</h3>
                    <ol className="space-y-4">
                      {[
                        "Verificar variables de entorno en Vercel Dashboard (Settings > Environment Variables).",
                        "Asegurar que el TOKEN no contenga espacios ni caracteres extra.",
                        "Usar el endpoint /api/activar proporcionado en este repositorio para renovar el Webhook.",
                        "Monitorear los Vercel Function Logs en busca de códigos 200 (OK)."
                      ].map((step, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                          <span className="font-mono text-white/40 group-hover:text-white transition-colors">0{i+1}</span>
                          <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Background Graphic Element */}
      <div className="fixed bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-white/40 to-transparent pointer-events-none -z-10" />
    </div>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
