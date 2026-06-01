"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Tv, Search, LogOut, Globe, Loader2, User } from 'lucide-react';

import { signIn, signOut, useSession } from 'next-auth/react'; 

export default function VibeRoom() {
  const { data } = useSession();
  const session = data as any; 

  // Состояния данных
  const [streams, setStreams] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['ВСЕ СТРИМЫ']);
  
  // Состояния интерфейса
  const [activeCategory, setActiveCategory] = useState('ВСЕ СТРИМЫ');
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // МАГИЯ: Автоматическая загрузка реальных стримов с Twitch
  useEffect(() => {
    const fetchRealStreams = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/twitch?language=${language}`);
        if (!res.ok) throw new Error('API Server error');
        
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setStreams(data);
          
          // Вытаскиваем уникальные названия игр/категорий (например: Dota 2, Just Chatting)
          const uniqueGames = Array.from(new Set(data.map(s => s.game_name))).filter(Boolean);
          // Ставим "ВСЕ СТРИМЫ" первым, и добавляем топ-10 самых популярных игр прямо сейчас
          setCategories(['ВСЕ СТРИМЫ', ...uniqueGames.slice(0, 10)]);
          setActiveCategory('ВСЕ СТРИМЫ');
        } else {
          setStreams([]);
        }
      } catch (error) {
        console.error("Не удалось загрузить стримы:", error);
      }
      setIsLoading(false);
    };

    fetchRealStreams();
  }, [language]); // Перезагружаем при смене языка

  // Умная фильтрация для интерфейса
  const filteredStreams = streams.filter(stream => {
    const matchesCategory = activeCategory === 'ВСЕ СТРИМЫ' || stream.game_name === activeCategory;
    const matchesSearch = stream.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Форматирование зрителей (например: 15400 -> 15.4K)
  const formatViewers = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-black text-white flex flex-col font-mono overflow-hidden">
      
      {/* КРАСИВЫЙ СКРОЛЛБАР (Глобально для всего сайта) */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}} />

      {/* HEADER (НАВИГАЦИЯ) */}
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
            placeholder="ПОИСК СТРИМЕРА ИЛИ ВАЙБА..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 px-4 py-2 pl-10 rounded-none focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all font-sans text-white"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-white/50" />
        </div>

        {/* Переключатель языка (Подтягивает новые данные) */}
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
                  <p className="text-xs text-cyan-400/80 italic p-2 bg-cyan-400/10 border border-cyan-400/20 rounded">
                    🛠 Интеграция подписок в разработке. Ожидайте в следующем патче!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">Войдите, чтобы видеть свои подписки.</p>
              )}
            </div>

            {/* АВТОМАТИЧЕСКИЕ КАТЕГОРИИ ИЗ TWITCH */}
            <div className="p-4 flex-1">
              <p className="text-xs text-white/30 font-bold mb-3 tracking-widest">КАТЕГОРИИ В ЭФИРЕ</p>
              <div className="flex flex-col gap-1">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-white/40 text-sm p-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Загрузка...
                  </div>
                ) : (
                  categories.map((cat, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-3 p-2 transition-all border-l-2 ${activeCategory === cat ? 'border-cyan-400 bg-white/10' : 'border-transparent hover:bg-white/5'}`}
                    >
                      {cat === 'ВСЕ СТРИМЫ' && <Tv className={`w-4 h-4 ${activeCategory === cat ? 'text-cyan-400' : 'text-white/50'}`} />}
                      <div className="text-left flex-1 overflow-hidden">
                        <p className={`font-bold text-sm truncate ${activeCategory === cat ? 'text-cyan-400' : 'text-white/80'}`}>{cat}</p>
                      </div>
                    </button>
                  ))
                )}
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
        <main className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative custom-scrollbar">
          <div className="absolute inset-0 bg-black/90 pointer-events-none"></div>
          
          <div className="relative z-10 p-4 md:p-8 max-w-[1600px] mx-auto">
            
            {/* Заголовок */}
            <div className="mb-8 border-l-4 border-cyan-400 pl-4 flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white truncate max-w-xl">
                  {activeCategory}
                </h1>
                <p className="text-cyan-400/80 font-sans mt-2">
                  {language === 'ru' ? 'В эфире прямо сейчас (RU)' : 'Live right now (Global)'}
                </p>
              </div>
              
              {isLoading && <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />}
            </div>

            {/* Сетка стримов из Twitch */}
            {!isLoading && filteredStreams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {filteredStreams.map(stream => (
                  <div key={stream.id} className="group relative bg-black border border-white/10 hover:border-cyan-400 transition-colors aspect-video flex flex-col cursor-pointer shadow-lg hover:shadow-cyan-500/20">
                    
                    {/* Плеер */}
                    <div className="flex-1 relative bg-zinc-900 overflow-hidden">
                      <iframe
                        src={`https://player.twitch.tv/?channel=${stream.user_login}&parent=viberoomtv.vercel.app&parent=localhost&muted=true`}
                        height="100%"
                        width="100%"
                        allowFullScreen
                        className="absolute inset-0" 
                      ></iframe>
                      
                      {/* Индикаторы поверх плеера (почти не мешают, но дают инфу) */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 flex items-center gap-1.5 shadow-md pointer-events-none">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 border border-white/10 pointer-events-none">
                        👁 {formatViewers(stream.viewer_count)}
                      </div>
                    </div>
                    
                    {/* Инфо под плеером */}
                    <div className="p-3 border-t border-white/10 bg-zinc-950">
                      <div className="flex justify-between items-start gap-2">
                        <div className="overflow-hidden">
                          <h3 className="font-bold truncate text-sm text-white group-hover:text-cyan-400 transition-colors" title={stream.title}>
                            {stream.title}
                          </h3>
                          <p className="text-xs text-white/50 mt-1">{stream.user_name} • {stream.game_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Пустое состояние */}
            {!isLoading && filteredStreams.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-white/30 border-2 border-dashed border-white/10 mt-8">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold">Тут никого нет.</p>
                <p className="text-sm mt-2 text-white/40">Попробуй изменить язык или категорию.</p>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}