"use client";

import React, { useState } from 'react';
import { Menu, X, Flame, Tv, Zap, Ghost, User, Upload, Search, Heart, Sparkles, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react'; // Импортируем магию авторизации

// Тестовые данные (пока нет базы данных)
const MOCK_STREAMS = [
  { id: 1, name: "KaiCenat", title: "AMP HOUSE WILDIN", viewers: "112K", category: "zoomers", isLive: true, tags: ["IRL", "Just Chatting"] },
  { id: 2, name: "xQc", title: "REACTS & GAMING", viewers: "65K", category: "popular", isLive: true, tags: ["Variety", "Juice"] },
  { id: 3, name: "Lirik", title: "CHILL SUNDAY SUB GAMES", viewers: "28K", category: "olds", isLive: true, tags: ["Gaming", "Chill"] },
  { id: 4, name: "summit1g", title: "GRINDING TARKOV", viewers: "32K", category: "olds", isLive: true, tags: ["FPS", "Hardcore"] },
  { id: 5, name: "Jynxzi", title: "R6 TOURNAMENT", viewers: "85K", category: "zoomers", isLive: true, tags: ["R6", "Console"] },
  { id: 6, name: "shroud", title: "CLICKING HEADS", viewers: "22K", category: "olds", isLive: true, tags: ["Aim", "Valorant"] },
  { id: 7, name: "Pluto", title: "NEW VTUBER DEBUT", viewers: "1.2K", category: "new", isLive: true, tags: ["VTuber", "Art"] },
  { id: 8, name: "AlexR", title: "CODING VIBEROOM", viewers: "345", category: "new", isLive: true, tags: ["Dev", "Music"] },
];

const CATEGORIES = [
  { id: 'all', name: 'ВСЕ СТРИМЫ', icon: Tv, color: 'text-green-400' },
  { id: 'popular', name: 'ПОПУЛЯРНОЕ', desc: '> 5000 зрителей', icon: Flame, color: 'text-white' },
  { id: 'new', name: 'ФРЕШМЕНЫ', desc: 'Стримят < 3 мес', icon: Zap, color: 'text-white' },
  { id: 'zoomers', name: 'ЗУМЕРЫ', desc: 'W/L Комьюнити', icon: Ghost, color: 'text-white' },
  { id: 'olds', name: 'ОЛДЫ', desc: 'Ностальгия', icon: Tv, color: 'text-white' },
];

export default function VibeRoom() {
  const { data: session } = useSession(); // Получаем данные пользователя из Twitch
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [isShortsOpen, setIsShortsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Логика фильтрации
  const filteredStreams = MOCK_STREAMS.filter(stream => {
    const matchesCategory = activeCategory === 'all' || stream.category === activeCategory;
    const matchesSearch = stream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen bg-black text-white flex flex-col font-mono">
      {/* HEADER (NAVBAR) */}
      <header className="h-16 border-b-2 border-white/10 flex items-center justify-between px-4 shrink-0 bg-black z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-black text-2xl tracking-tighter leading-none flex items-center">
            <span className="text-white">VIBE</span>
            <span className="text-green-400">ROOM</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input 
            type="text" 
            placeholder="ПОИСК ВАЙБА..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 px-4 py-2 pl-10 rounded-none focus:outline-none focus:border-green-400 focus:bg-white/10 transition-all font-sans"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/50" />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsShortsOpen(!isShortsOpen)}
            className={`px-4 py-2 border-2 text-sm font-bold transition-all ${isShortsOpen ? 'bg-green-400 text-black border-green-400' : 'bg-transparent text-white border-white/20 hover:border-white'}`}
          >
            SHORTS
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR (НАВИГАЦИЯ & АВТОРИЗАЦИЯ) */}
        {isLeftMenuOpen && (
          <aside className="w-64 border-r-2 border-white/10 flex flex-col bg-black/95 z-40 overflow-y-auto shrink-0">
            {/* Блок авторизации */}
            <div className="p-4 border-b-2 border-white/10">
              {session ? (
                // Если пользователь вошел
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={session.user?.image || "https://api.dicebear.com/7.x/pixel-art/svg"} 
                      alt="Avatar" 
                      className="w-10 h-10 border-2 border-green-400"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold truncate text-green-400">{session.user?.name}</p>
                      <p className="text-xs text-white/50">В здании</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 p-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> ВЫЙТИ
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 p-3 bg-white text-black font-bold hover:bg-green-400 transition-colors mt-2">
                    <Upload className="w-4 h-4" /> ЗАЛИТЬ SHORTS
                  </button>
                </div>
              ) : (
                // Если пользователь НЕ вошел
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => signIn('twitch')}
                    className="w-full flex items-center gap-3 p-3 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors group"
                  >
                    <User className="w-5 h-5 text-green-400 group-hover:text-black" />
                    <span className="font-bold">ВОЙТИ ЧЕРЕЗ TWITCH</span>
                  </button>
                  <div className="p-3 border border-white/10 bg-white/5 text-xs text-center text-white/70">
                    <span className="text-green-400 font-bold">PROMO:</span> Первые 30 дней в топе ленты бесплатно после авторизации!
                  </div>
                </div>
              )}
            </div>

            {/* Меню категорий */}
            <div className="p-4 flex-1">
              <p className="text-xs text-white/30 font-bold mb-4 tracking-widest">КАТЕГОРИИ</p>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 transition-all border-l-4 ${activeCategory === cat.id ? 'border-green-400 bg-white/5' : 'border-transparent hover:bg-white/5 hover:border-white/20'}`}
                    >
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                      <div className="text-left flex-1">
                        <p className="font-bold text-sm">{cat.name}</p>
                        {cat.desc && <p className="text-xs text-white/40">{cat.desc}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ПЛАШКА СОЗДАТЕЛЯ (TaFeedRoom) */}
            <div className="mt-auto border-t-2 border-white/10 p-4 bg-gradient-to-t from-green-900/20 to-transparent">
              <p className="text-[10px] text-white/50 font-bold mb-2 tracking-widest text-center">СДЕЛАНО С 💜</p>
              <a 
                href="https://twitch.tv/tafeedroom" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 border-2 border-green-400/50 hover:border-green-400 bg-black transition-all group"
              >
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-black font-black">
                  TF
                </div>
                <div>
                  <p className="font-bold text-sm group-hover:text-green-400 transition-colors">TaFeedRoom</p>
                  <p className="text-[10px] text-white/60">Создатель VibeRoom</p>
                </div>
              </a>
            </div>
          </aside>
        )}

        {/* MAIN FEED */}
        <main className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
          <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase">
                {CATEGORIES.find(c => c.id === activeCategory)?.name || 'В ЭФИРЕ'}
              </h1>
              <p className="text-white/60 font-sans max-w-lg">
                Как создать незабываемый опыт. Выбери свою вибрацию на сегодня.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStreams.map(stream => (
                <div key={stream.id} className="group relative bg-black border-2 border-white/10 hover:border-green-400 transition-colors aspect-video flex flex-col cursor-pointer">
                  {/* Контейнер для плеера */}
                  <div className="flex-1 relative bg-zinc-900 overflow-hidden">
                    {/* Если мы на локалке (localhost) или на vercel, iframe подхватит домен */}
                    <iframe
                      src={`https://player.twitch.tv/?channel=${stream.name}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true`}
                      height="100%"
                      width="100%"
                      allowFullScreen
                      className="absolute inset-0 pointer-events-none" // Блокируем клики по плееру, чтобы клик шел на наш блок
                    ></iframe>
                    
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1">
                      {stream.viewers}
                    </div>
                  </div>
                  {/* Информация под плеером */}
                  <div className="p-3 border-t-2 border-white/10 bg-black">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold uppercase truncate max-w-[200px]">{stream.title}</h3>
                        <p className="text-sm text-white/60">{stream.name}</p>
                      </div>
                      <div className="px-2 py-1 bg-white/10 text-[10px] uppercase font-bold text-white/50">
                        {stream.category}
                      </div>
                    </div>
                  </div>
                  {/* Hover-эффект */}
                  <div className="absolute inset-0 border-4 border-green-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              ))}
            </div>
            
            {filteredStreams.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-white/30 border-2 border-dashed border-white/10">
                <Ghost className="w-12 h-12 mb-4" />
                <p>В этой категории сейчас пусто. Будь первым!</p>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR (SHORTS FEED) */}
        {isShortsOpen && (
          <aside className="w-80 border-l-2 border-white/10 bg-black flex flex-col relative z-40 hidden lg:flex shrink-0">
            <div className="p-4 border-b-2 border-white/10 flex justify-between items-center bg-black sticky top-0 z-10">
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <Sparkles className="w-4 h-4" /> SHORTS FEED
              </div>
              <button onClick={() => setIsShortsOpen(false)} className="hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-zinc-950">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-full w-full snap-start border-b border-white/5 relative bg-zinc-900 group flex items-center justify-center">
                  <Tv className="w-12 h-12 text-white/10" />
                  <p className="absolute bottom-1/2 text-white/20 text-xs tracking-widest">ВИДЕО ЗАГРУЖАЕТСЯ...</p>
                  
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-green-400 font-bold text-xs mb-1">@xQc</p>
                    <p className="text-sm font-bold truncate">CRAZY JUMP SCARE 😱</p>
                  </div>

                  <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                    <button className="p-3 bg-black/50 backdrop-blur rounded-full hover:bg-green-400 hover:text-black transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold text-center">1.2M</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}