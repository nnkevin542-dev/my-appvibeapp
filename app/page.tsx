"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Flame, Tv, Zap, MessageSquare, Trophy, User, Search, LogOut, Globe } from 'lucide-react';

import { signIn, signOut, useSession } from 'next-auth/react'; 

// Обновленная база данных (добавлен язык и русские стримеры)
const MOCK_STREAMS = [
  { id: 1, name: "bratishkinoff", title: "СМОТРИМ ВИДОСЫ | ПИКСЕЛЬ БАТЛ", viewers: "45K", category: "chatting", language: "ru", isLive: true },
  { id: 2, name: "Evelone192", title: "МАФИЯ С СТРИМЕРАМИ НА 1.000.000", viewers: "60K", category: "popular", language: "ru", isLive: true },
  { id: 3, name: "cs2_paragon_ru", title: "NAVI vs FAZE | GRAND FINAL", viewers: "120K", category: "tournaments", language: "ru", isLive: true },
  { id: 4, name: "buster", title: "ИГРАЕМ В КС", viewers: "35K", category: "popular", language: "ru", isLive: true },
  { id: 5, name: "KaiCenat", title: "AMP HOUSE WILDIN", viewers: "112K", category: "popular", language: "en", isLive: true },
  { id: 6, name: "xQc", title: "REACTS & GAMING", viewers: "65K", category: "chatting", language: "en", isLive: true },
  { id: 7, name: "BLASTPremier", title: "BLAST FALL FINAL 2026", viewers: "85K", category: "tournaments", language: "en", isLive: true },
  { id: 8, name: "tafeedroom", title: "ПИШЕМ СВОЙ ТВИЧ НА КОЛЕНКЕ", viewers: "1.2K", category: "new", language: "ru", isLive: true },
  { id: 9, name: "jynxzi", title: "R6 1v1 TOURNAMENT", viewers: "75K", category: "popular", language: "en", isLive: true },
];

// Обновленные категории
const CATEGORIES = [
  { id: 'all', name: 'ВСЕ СТРИМЫ', icon: Tv, color: 'text-cyan-400' },
  { id: 'popular', name: 'ПОПУЛЯРНОЕ', desc: '> 5000 зрителей', icon: Flame, color: 'text-white' },
  { id: 'chatting', name: 'ОБЩЕНИЕ', desc: 'Just Chatting / IRL', icon: MessageSquare, color: 'text-white' },
  { id: 'tournaments', name: 'ТУРНИРЫ', desc: 'Киберспорт', icon: Trophy, color: 'text-white' },
  { id: 'new', name: 'ФРЕШМЕНЫ', desc: 'Новые таланты', icon: Zap, color: 'text-white' },
];

export default function VibeRoom() {
  const { data } = useSession();
  const session = data as any; 

  const [activeCategory, setActiveCategory] = useState('all');
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru'); // Состояние языка по умолчанию RU
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Умная система фильтрации (по языку, категории и поиску)
  const filteredStreams = MOCK_STREAMS.filter(stream => {
    const matchesLanguage = stream.language === language;
    const matchesCategory = activeCategory === 'all' || stream.category === activeCategory;
    const matchesSearch = stream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesCategory && matchesSearch;
  });

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-black text-white flex flex-col font-mono overflow-hidden">
      
      {/* СТИЛИ ДЛЯ СКРОЛЛБАРА (Убираем белые уродливые полосы) */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #164e63; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
      `}} />

      {/* HEADER (NAVBAR) */}
      <header className="h-16 border-b-2 border-white/10 flex items-center justify-between px-4 shrink-0 bg-black z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
            <Menu className="w-6 h-6 text-cyan-400" />
          </button>
          <div className="font-black text-2xl tracking-tighter leading-none flex items-center select-none">
            <span className="text-white">VIBE</span>
            <span className="text-cyan-400">ROOM</span>
          </div>
        </div>

        {/* Поиск */}
        <div className="flex-1 max-w-2xl mx-8 relative hidden md:block">
          <input 
            type="text" 
            placeholder="ПОИСК ВАЙБА..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 px-4 py-2 pl-10 rounded-none focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-sans text-white"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/50" />
        </div>

        {/* Переключатель языка */}
        <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/10 rounded">
          <Globe className="w-4 h-4 text-white/50 ml-2" />
          <button 
            onClick={() => setLanguage('ru')}
            className={`px-3 py-1 text-xs font-bold transition-colors ${language === 'ru' ? 'bg-cyan-400 text-black' : 'text-white/50 hover:text-white'}`}
          >
            RU
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold transition-colors ${language === 'en' ? 'bg-cyan-400 text-black' : 'text-white/50 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ЛЕВОЕ МЕНЮ */}
        {isLeftMenuOpen && (
          <aside className="w-64 border-r-2 border-white/10 flex flex-col bg-black/95 z-40 overflow-y-auto shrink-0 custom-scrollbar">
            
            {/* Блок авторизации */}
            <div className="p-4 border-b-2 border-white/10">
              {session?.user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-white/5 p-2 border border-white/10">
                    <img 
                      src={session.user.image || "https://api.dicebear.com/7.x/pixel-art/svg"} 
                      alt="Avatar" 
                      className="w-10 h-10 border-2 border-cyan-400"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold truncate text-cyan-400 text-sm">{session.user.name}</p>
                      <p className="text-[10px] text-white/50 uppercase">Авторизован</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 p-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> ВЫЙТИ
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => signIn('twitch')}
                    className="w-full flex items-center gap-3 p-3 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors group bg-cyan-400/5"
                  >
                    <User className="w-5 h-5 text-cyan-400 group-hover:text-black" />
                    <span className="font-bold text-sm">ВОЙТИ (TWITCH)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Блок: ОТСЛЕЖИВАЕМЫЕ (Подписки) */}
            <div className="p-4 border-b-2 border-white/10">
              <p className="text-xs text-white/30 font-bold mb-3 tracking-widest">ОТСЛЕЖИВАЕМЫЕ</p>
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  {/* Имитация списка подписок, которые сейчас онлайн */}
                  {MOCK_STREAMS.slice(0, 3).map((stream, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                          {stream.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold truncate group-hover:text-cyan-400 transition-colors">{stream.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-white/50">{stream.viewers}</span>
                      </div>
                    </div>
                  ))}
                  <button className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold mt-2 text-left">
                    ПОКАЗАТЬ ВСЕХ
                  </button>
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Войдите, чтобы видеть свои подписки.</p>
              )}
            </div>

            {/* Меню категорий */}
            <div className="p-4 flex-1">
              <p className="text-xs text-white/30 font-bold mb-3 tracking-widest">КАТЕГОРИИ</p>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 p-3 transition-all border-l-2 ${activeCategory === cat.id ? 'border-cyan-400 bg-white/10' : 'border-transparent hover:bg-white/5 hover:border-white/20'}`}
                    >
                      <Icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-cyan-400' : 'text-white/50'}`} />
                      <div className="text-left flex-1">
                        <p className="font-bold text-sm">{cat.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ПЛАШКА СОЗДАТЕЛЯ (TaFeedRoom -> Telegram) */}
            <div className="mt-auto border-t-2 border-white/10 p-4 bg-gradient-to-t from-cyan-900/20 to-transparent">
              <p className="text-[10px] text-cyan-400 font-bold mb-2 tracking-widest text-center uppercase">Создатель платформы</p>
              <a 
                href="https://t.me/tafeedrooms" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 border border-cyan-400/30 hover:border-cyan-400 bg-black transition-all group"
              >
                <div className="w-8 h-8 bg-cyan-400 flex items-center justify-center text-black font-black shrink-0">
                  TF
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm group-hover:text-cyan-400 transition-colors truncate">TaFeedRoom</p>
                  <p className="text-[10px] text-white/60 truncate">Подпишись в Telegram</p>
                </div>
              </a>
            </div>
          </aside>
        )}

        {/* ГЛАВНАЯ ЛЕНТА */}
        <main className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
          <div className="absolute inset-0 bg-black/90 pointer-events-none"></div>
          
          <div className="relative z-10 p-4 md:p-8 max-w-[1600px] mx-auto">
            {/* Заголовок текущей категории */}
            <div className="mb-8 border-l-4 border-cyan-400 pl-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">
                {CATEGORIES.find(c => c.id === activeCategory)?.name || 'В ЭФИРЕ'}
              </h1>
              <p className="text-cyan-400/80 font-sans mt-2">
                {language === 'ru' ? 'Выбран регион: СНГ / Россия' : 'Region Selected: English / Global'}
              </p>
            </div>

            {/* Сетка стримов */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {filteredStreams.map(stream => (
                <div key={stream.id} className="group relative bg-black border border-white/10 hover:border-cyan-400 transition-colors aspect-video flex flex-col cursor-pointer shadow-lg hover:shadow-cyan-500/20">
                  {/* Плеер */}
                  <div className="flex-1 relative bg-zinc-900 overflow-hidden">
                    <iframe
                      src={`https://player.twitch.tv/?channel=${stream.name}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=true`}
                      height="100%"
                      width="100%"
                      allowFullScreen
                      className="absolute inset-0 pointer-events-none" 
                    ></iframe>
                    
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-1.5 shadow-md">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 border border-white/10">
                      👁 {stream.viewers}
                    </div>
                  </div>
                  
                  {/* Инфо под плеером */}
                  <div className="p-3 border-t border-white/10 bg-zinc-950">
                    <div className="flex justify-between items-start gap-2">
                      <div className="overflow-hidden">
                        <h3 className="font-bold uppercase truncate text-sm text-white group-hover:text-cyan-400 transition-colors">{stream.title}</h3>
                        <p className="text-xs text-white/50 mt-1">{stream.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredStreams.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-white/30 border-2 border-dashed border-white/10 mt-8">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold">В этой категории сейчас нет стримеров онлайн.</p>
                <p className="text-sm mt-2 text-white/40">Попробуй переключить язык или категорию.</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}