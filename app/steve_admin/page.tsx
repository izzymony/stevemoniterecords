"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Disc, 
  Video, 
  Calendar, 
  Settings, 
  Plus, 
  X, 
  Camera, 
  ChevronRight,
  LogOut,
  ExternalLink,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Modular Component Imports
import Overview from '../components/overview';
import Releases from '../components/releases';
import Videos from '../components/media/videos';
import Gallery from '../components/media/gallery';
import Events from '../components/events';

// --- Shared Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            active ? "bg-accent-orange text-white shadow-lg shadow-accent-orange/20" : "text-white/40 hover:text-white hover:bg-white/5"
        )}
    >
        <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-accent-orange")} />
        <span className="font-bold uppercase tracking-widest text-[10px]">{label}</span>
    </button>
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'releases' | 'videos' | 'events' | 'gallery'>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent-orange/30">
            <div className="fixed inset-0 bg-grain pointer-events-none opacity-[0.03]" />
            
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#050505] p-6 z-[70] transition-transform duration-500 lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center">
                            <Music className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-sm">Steve Admin</span>
                    </div>
                    <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-full">
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                </div>

                <nav className="space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Disc} label="Releases" active={activeTab === 'releases'} onClick={() => { setActiveTab('releases'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Video} label="Videos" active={activeTab === 'videos'} onClick={() => { setActiveTab('videos'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Camera} label="Gallery" active={activeTab === 'gallery'} onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }} />
                    <SidebarItem icon={Calendar} label="Events" active={activeTab === 'events'} onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} />
                </nav>

                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-white/5">
                    <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">View Site</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-500 transition-all mt-2">
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:pl-64 min-h-screen relative z-10 transition-all duration-500">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10">
                            <LayoutDashboard className="w-5 h-5 text-accent-orange" />
                        </button>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <span className="hidden sm:inline">Admin Dashboard</span>
                            <ChevronRight className="w-3 h-3 hidden sm:inline" />
                            <span className="text-white capitalize">{activeTab}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                            <img src="/WhatsApp Image 2026-05-12 at 10.02.23.jpeg" className="object-cover" alt="User" />
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Rendering */}
                <div className="p-6 lg:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && <Overview />}
                            {activeTab === 'releases' && <Releases />}
                            {activeTab === 'videos' && <Videos />}
                            {activeTab === 'gallery' && <Gallery />}
                            {activeTab === 'events' && <Events />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
