"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Card = ({ children, title, action }: { children: React.ReactNode, title: string, action?: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden glass-dark">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
            {action}
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        // Assuming an 'events' table exists in Supabase
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (data) setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) fetchEvents();
    };

    return (
        <Card title="Tour Schedule & Events" action={
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                <Plus className="w-3 h-3" /> Schedule Event
            </button>
        }>
            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-white/20 uppercase tracking-[0.3em] font-black animate-pulse">Loading schedule...</div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center text-white/20 uppercase tracking-[0.3em] font-black italic">No upcoming events</div>
                ) : (
                    events.map((event) => (
                        <motion.div 
                            key={event.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl glass border border-white/5 hover:border-accent-orange/50 transition-all duration-500 group"
                        >
                            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="w-4 h-4 text-accent-orange" />
                                    <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-accent-orange transition-colors">{event.city}</span>
                                </div>
                                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{event.venue}</span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="text-center md:text-right">
                                    <span className="block text-xl font-black">{event.date}</span>
                                    <span className={cn(
                                        "text-[8px] uppercase font-black px-2 py-1 rounded-md",
                                        event.status === "Sold Out" ? "bg-red-500/20 text-red-500" : "bg-accent-green/20 text-accent-green"
                                    )}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                                    <button 
                                        onClick={() => handleDelete(event.id)}
                                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default Events;