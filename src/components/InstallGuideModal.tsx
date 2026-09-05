import React, { useState } from 'react';
import { X, Smartphone, Apple, Monitor, Terminal, Check, Share2, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop' | 'native'>('android');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Instalar en tu Dispositivo</h3>
              <p className="text-[11px] text-slate-400">Android, iPhone, Desktop o APK nativa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => setPlatform('android')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              platform === 'android' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setPlatform('ios')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              platform === 'ios' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-200" />
            <span>iPhone</span>
          </button>

          <button
            onClick={() => setPlatform('desktop')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              platform === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-blue-400" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setPlatform('native')}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              platform === 'native' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Capacitor</span>
          </button>
        </div>

        {/* Platform Guide Content */}
        <div className="p-5 text-xs text-slate-300 space-y-4 max-h-[65vh] overflow-y-auto">
          {platform === 'android' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-black">1</div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Abre la app en Google Chrome</h4>
                  <p className="text-slate-400 text-[11px]">Navega a la URL en tu móvil Android.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-black">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Toca el menú de opciones (tres puntos)</h4>
                  <p className="text-slate-400 text-[11px]">En la esquina superior derecha del navegador.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-black">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Selecciona "Instalar aplicación"</h4>
                  <p className="text-slate-400 text-[11px]">
                    Se creará un icono independiente en tu pantalla de inicio y funcionará a pantalla completa sin barra de navegación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {platform === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 font-black">1</div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Abre la app en Safari</h4>
                  <p className="text-slate-400 text-[11px]">iOS requiere Safari para añadir aplicaciones PWA.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 font-black">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Toca el botón Compartir</h4>
                  <p className="text-slate-400 text-[11px]">El icono cuadrado con la flecha hacia arriba en la barra inferior.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 font-black">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5">Toca "Añadir a pantalla de inicio"</h4>
                  <p className="text-slate-400 text-[11px]">
                    Confirma y pulsa "Añadir". Se instalará con su icono oficial de LaLiga y se abrirá como app nativa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {platform === 'desktop' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>Instalación en Chrome / Edge / Brave</span>
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  En la barra de direcciones de tu navegador, verás un icono de <strong>Instalar</strong> (un monitor con una flecha hacia abajo).
                  Haz clic en él y selecciona <strong>Instalar</strong>.
                </p>
                <p className="text-slate-400 text-[11px]">
                  La app se ejecutará en su propia ventana sin marcos de navegador, con soporte para atajos de teclado y multitarea en tu escritorio.
                </p>
              </div>
            </div>
          )}

          {platform === 'native' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-[11px]">
                El proyecto ya incluye la configuración de <strong>Capacitor</strong> para generar los proyectos nativos de Android Studio y Xcode:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">1. Compilar web y sincronizar</span>
                    <button
                      onClick={() => copyCommand('npm run build && npx cap sync')}
                      className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedCmd === 'npm run build && npx cap sync' ? <Check className="w-3 h-3 text-emerald-400" /> : 'Copiar'}
                    </button>
                  </div>
                  <code className="text-rose-400 font-mono text-[11px]">npm run build && npx cap sync</code>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">2. Abrir en Android Studio (APK)</span>
                    <button
                      onClick={() => copyCommand('npx cap open android')}
                      className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedCmd === 'npx cap open android' ? <Check className="w-3 h-3 text-emerald-400" /> : 'Copiar'}
                    </button>
                  </div>
                  <code className="text-rose-400 font-mono text-[11px]">npx cap open android</code>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">3. Abrir en Xcode (iOS)</span>
                    <button
                      onClick={() => copyCommand('npx cap open ios')}
                      className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedCmd === 'npx cap open ios' ? <Check className="w-3 h-3 text-emerald-400" /> : 'Copiar'}
                    </button>
                  </div>
                  <code className="text-rose-400 font-mono text-[11px]">npx cap open ios</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
