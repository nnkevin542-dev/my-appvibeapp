"use client";
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Tv, Flame, Baby, MonitorPlay, 
  Video, Upload, LogIn, User, Heart, ShieldAlert 
} from 'lucide-react';

// --- БАЗА ДАННЫХ КАТЕГОРИЙ ---
const CATEGORIES = [
  { id: 'popular', name: 'ПОПУЛЯРНОЕ', icon: Flame, desc: '> 5000 зрителей' },
  { id: 'new', name: 'ФРЕШМЕНЫ', icon: Tv, desc: 'Стримят > 3 мес' },
  { id: 'zoomers', name: 'ЗУМЕРЫ', icon: Baby, desc: 'W/L Комьюнити' },
  { id: 'olds', name: 'ОЛДЫ', icon: MonitorPlay, desc: 'Ностальгия' },
];

// --- ИМИТАЦИЯ ДАННЫХ ИЗ НАШЕГО БЭКЕНДА (с реальными никами Twitch) ---
const MOCK_STREAMS = [
  { id: 1, name: 'KaiCenat', category: 'zoomers', title: 'AMP HOUSE WILDIN' },
  { id: 2, name: 'xQc', category: 'popular', title: 'REACTS & GAMING' },
  { id: 3, name: 'Lirik', category: 'olds', title: 'CHILL SUNDAY SUB DAY' },
  { id: 4, name: 'Summit1g', category: 'olds', title: 'GRINDING TARKOV' },
  { id: 5, name: 'Jynxzi', category: 'zoomers', title: 'R6 TOURNAMENT' },
  { id: 6, name: 'shroud', category: 'olds', title: 'CLICKING HEADS' },
  { id: 7, name: 'Ibai', category: 'popular', title: 'LA VELADA PREP' },
  { id: 8, name: 'hasanabi', category: 'popular', title: 'NEWS & CHILL' },
];

// Фильтр запрещенных слов (Safety System)
const BANWORDS = ['hate', 'slur', 'banned_word_1', 'illegal'];

const MOCK_SHORTS = [
  { id: 101, author: 'xQc', title: 'CRAZY JUMP SCARE', likes: '1.2M', safe: true },
  { id: 102, author: 'Jynxzi', title: '1v5 CLUTCH', likes: '800K', safe: true },
  { id: 103, author: 'TrollUser', title: 'I hate everyone slur', likes: '10', safe: false }, // Отфильтруется
  { id: 104, author: 'KaiCenat', title: 'AMP SETUP TOUR', likes: '2.5M', safe: true },
];

export default function VibeRoomApp() {
  // --- СОСТОЯНИЯ ---
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Состояние для безопасного определения домена для плеера Twitch
  const [hostname, setHostname] = useState('localhost');

  useEffect(() => {
    // Получаем текущий домен сайта после загрузки (защита от ошибок SSR)
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
    }
  }, []);
  
  // Система рекомендаций: Фильтрация стримов
  const displayedStreams = activeCategory === 'all' 
    ? MOCK_STREAMS 
    : MOCK_STREAMS.filter(s => s.category === activeCategory);

  // Автоматический модератор (фильтр тиктоков)
  const safeShorts = MOCK_SHORTS.filter(short => {
    const textToCheck = short.title.toLowerCase();
    return !BANWORDS.some(word => textToCheck.includes(word));
  });

  return (
    <div className="flex h-screen bg-[#f4f4f4] text-black font-sans overflow-hidden selection:bg-[#adff2f] selection:text-black">
      {/* Подключение пиксельного шрифта и стилей */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixel-font { font-family: 'Press Start 2P', cursive; }
        .glass-bag {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(0, 0, 0, 0.8);
          box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255,255,255,0.5);
        }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />

      {/* ================= ЛЕВАЯ ПАНЕЛЬ (ПРОФИЛЬ & НАВИГАЦИЯ) ================= */}
      <aside 
        className={`bg-white border-r-4 border-black flex flex-col transition-all duration-300 z-20 ${leftOpen ? 'w-72' : 'w-20'}`}
      >
        <div className="p-4 border-b-4 border-black flex items-center justify-between bg-black text-white h-20">
          {leftOpen && (
            <h1 className="pixel-font text-xl text-[#adff2f] tracking-tighter">VIBE<br/>ROOM</h1>
          )}
          <button onClick={() => setLeftOpen(!leftOpen)} className="p-2 hover:bg-[#adff2f] hover:text-black transition-colors rounded">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {/* Авторизация / Профиль */}
          <div className="flex flex-col gap-2">
            {!isLoggedIn ? (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className={`flex items-center justify-center gap-2 bg-[#9146FF] text-white p-3 border-2 border-black hover:bg-[#adff2f] hover:text-black font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${!leftOpen && 'p-2'}`}
              >
                <LogIn size={20} />
                {leftOpen && "Войти через Twitch"}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-gray-100 p-2 border-2 border-black">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#adff2f]">
                    <User size={20} />
                  </div>
                  {leftOpen && <span className="font-bold pixel-font text-xs uppercase">Ты в Здании</span>}
                </div>
                {leftOpen && (
                  <button className="flex items-center justify-center gap-2 bg-black text-white p-2 border-2 border-black hover:bg-[#adff2f] hover:text-black font-bold uppercase transition-all">
                    <Upload size={18} /> Залить Shorts
                  </button>
                )}
              </div>
            )}
          </div>

          <hr className="border-t-2 border-black border-dashed" />

          {/* Категории */}
          <div className="flex flex-col gap-2">
            {leftOpen && <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Категории</h3>}
            
            <button 
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-3 p-3 border-2 border-black font-bold uppercase transition-all ${activeCategory === 'all' ? 'bg-[#adff2f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'} ${!leftOpen && 'justify-center'}`}
            >
              <Video size={20} />
              {leftOpen && "ВСЕ СТРИМЫ"}
            </button>

            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 p-3 border-2 border-black font-bold uppercase transition-all ${activeCategory === cat.id ? 'bg-[#adff2f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'} ${!leftOpen && 'justify-center'}`}
                title={cat.desc}
              >
                <cat.icon size={20} />
                {leftOpen && (
                  <div className="flex flex-col items-start">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-600 normal-case font-normal">{cat.desc}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Подписки из Twitch */}
          {isLoggedIn && leftOpen && (
            <>
              <hr className="border-t-2 border-black border-dashed" />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold uppercase text-xs tracking-widest flex items-center gap-2"><Heart size={14} className="text-red-500"/> Отслеживаемые</h3>
                {['KaiCenat', 'Lirik', 'xQc'].map(sub => (
                  <div key={sub} className="flex items-center justify-between p-2 hover:bg-gray-200 cursor-pointer border-2 border-transparent hover:border-black transition-all">
                    <span className="font-bold text-sm">{sub}</span>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ================= ЦЕНТРАЛЬНАЯ ПАНЕЛЬ (СТРИМЫ TWITCH) ================= */}
      <main className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
        {/* Фоновый декор */}
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none z-0">
           <h1 className="pixel-font text-[120px] leading-none whitespace-nowrap overflow-hidden">
              DESIGN<br/>WRAP
           </h1>
        </div>

        <div className="p-10 relative z-10 max-w-7xl mx-auto min-h-full">
          
          <header className="mb-12 flex justify-between items-end border-b-8 border-black pb-4">
            <div>
              <h2 className="pixel-font text-4xl uppercase mb-2">
                {activeCategory === 'all' ? 'В эфире' : CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-xl font-medium max-w-lg">
                Как создать незабываемый опыт. Выбери свою вибрацию на сегодня.
              </p>
            </div>
            <div className="pixel-font text-[#adff2f] bg-black px-4 py-2 text-sm shadow-[4px_4px_0px_0px_rgba(173,255,47,1)]">
              [ LIVE_NOW ]
            </div>
          </header>

          {/* Сетка стримов */}
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {displayedStreams.map(stream => (
              <div key={stream.id} className="group relative bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(173,255,47,1)] hover:-translate-y-1 transition-all flex flex-col">
                
                {/* НАСТОЯЩИЙ ПЛЕЕР TWITCH */}
                <div className="w-full aspect-video border-2 border-black mb-3 relative overflow-hidden bg-black group-hover:border-[#adff2f] transition-colors">
                  
                  {/* Загружаем iframe только если у нас есть корректный hostname */}
                  {hostname && (
                    <iframe
                      src={`https://player.twitch.tv/?channel=${stream.name.toLowerCase()}&parent=${hostname}&muted=true`}
                      height="100%"
                      width="100%"
                      allowFullScreen
                      className="absolute inset-0 z-0"
                    ></iframe>
                  )}
                  
                  {/* Красивый бейдж LIVE поверх плеера (не кликабельный) */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] pixel-font px-2 py-1 flex items-center gap-2 z-10 pointer-events-none">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg leading-tight uppercase truncate max-w-[200px]" title={stream.title}>{stream.title}</h3>
                    <p className="text-sm text-gray-600 font-bold">{stream.name}</p>
                  </div>
                  <span className="text-[10px] border border-black px-1 uppercase font-bold text-gray-500">{stream.category}</span>
                </div>
              </div>
            ))}
          </div>

          {displayedStreams.length === 0 && (
            <div className="text-center py-20 pixel-font text-gray-400">
              Никто не стримит в этой категории...
            </div>
          )}

        </div>
      </main>

      {/* ================= ПРАВАЯ ПАНЕЛЬ (SHORTS / ЛЕНТА) ================= */}
      <aside 
        className={`bg-black border-l-4 border-black flex flex-col transition-all duration-300 z-20 relative ${rightOpen ? 'w-80' : 'w-20'}`}
      >
        <button 
          onClick={() => setRightOpen(!rightOpen)} 
          className="absolute -left-12 top-4 bg-[#adff2f] p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-30"
        >
          {rightOpen ? <X size={24} className="text-black"/> : <Tv size={24} className="text-black"/>}
        </button>

        <div className="p-4 border-b-2 border-white/20 h-20 flex items-center justify-center">
          {rightOpen ? (
             <h2 className="pixel-font text-white text-lg tracking-widest text-center w-full">SHORTS<br/><span className="text-[#adff2f] text-[10px]">FEED</span></h2>
          ) : (
            <span className="text-white pixel-font text-xs rotate-90 whitespace-nowrap mt-10">SHORTS</span>
          )}
        </div>

        {rightOpen && (
          <div className="flex-1 overflow-y-auto snap-y snap-mandatory bg-[#111]">
            {/* Рендерим безопасные видео */}
            {safeShorts.map(short => (
              <div key={short.id} className="w-full h-full snap-start snap-always relative border-b-4 border-black group">
                
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                   <div className="text-center">
                      <Tv size={48} className="mx-auto text-white/20 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="pixel-font text-[10px] text-white/40">ВИДЕО ЗАГРУЖАЕТСЯ...</p>
                   </div>
                </div>

                <div className="absolute inset-0 glass-bag opacity-30 pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-10 flex justify-between items-end">
                  <div className="w-3/4">
                    <p className="text-[#adff2f] pixel-font text-[10px] mb-2">@{short.author}</p>
                    <h3 className="text-white font-bold text-lg leading-tight uppercase">{short.title}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 items-center">
                    <button className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover/btn:bg-red-500 transition-colors">
                         <Heart size={20} className="text-white" />
                      </div>
                      <span className="text-white text-xs font-bold">{short.likes}</span>
                    </button>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <span className="pixel-font text-[#adff2f]/50 text-4xl">{"<scroll>"}</span>
                </div>
              </div>
            ))}
            
             <div className="w-full h-full snap-start snap-always relative flex flex-col items-center justify-center bg-black p-8 text-center border-b-4 border-black">
                <ShieldAlert size={48} className="text-[#adff2f] mb-4" />
                <h3 className="pixel-font text-[#adff2f] text-sm mb-2">АЛГОРИТМ РАБОТАЕТ</h3>
                <p className="text-white/60 text-sm">Весь неприемлемый контент (banwords) был отфильтрован нашей системой.</p>
             </div>
          </div>
        )}
      </aside>
    </div>
  );
}