"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Disc, Edit3, Trash2, X, Upload, Camera, Calendar, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';


interface Release {
    id: string;
    title: string;
    type: string;
    release_date: string;
    img_url: string;
    spotify_url: string;
}

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

const Releases = () => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Single");
    const [date, setDate] = useState("");
    const [spotifyUrl, setSpotifyUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchReleases = async () => {
        setLoading(true);
        const { data } = await supabase.from('releases').select('*').order('created_at', { ascending: false });
        if (data) setReleases(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReleases();
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this release?")) return;
        const { error } = await supabase.from('releases').delete().eq('id', id);
        if (!error) fetchReleases();
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            let img_url = previewUrl;

            // 1. Upload new image if selected
            if (selectedFile) {
                const fileName = `releases/${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
                const filePath = `public/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('steve_monite_uploads')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('steve_monite_uploads')
                    .getPublicUrl(filePath);
                
                img_url = publicUrl;
            }

            const payload = {
                title,
                type,
                release_date: date,
                img_url,
                spotify_url: spotifyUrl,
            };

            // 2. Insert or Update
            if (editingId) {
                const { error: dbError } = await supabase
                    .from('releases')
                    .update(payload)
                    .eq('id', editingId);
                if (dbError) throw dbError;
            } else {
                const { error: dbError } = await supabase
                    .from('releases')
                    .insert(payload);
                if (dbError) throw dbError;
            }
        },
        onSuccess: () => {
            fetchReleases();
            setIsModalOpen(false);
            resetForm();
        },
        onError: (err: any) => {
            alert(`Error: ${err.message}`);
        }
    });

    const resetForm = () => {
        setTitle("");
        setType("Single");
        setDate("");
        setSpotifyUrl("");
        setEditingId(null);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleEdit = (item: Release) => {
        setEditingId(item.id);
        setTitle(item.title);
        setType(item.type);
        setDate(item.release_date);
        setSpotifyUrl(item.spotify_url);
        setSelectedFile(null);
        setPreviewUrl(item.img_url);
        setIsModalOpen(true);
    };

    return (
        <Card title="Manage Discography" action={
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
                <Plus className="w-3 h-3" /> Add Release
            </button>
        }>
            <div className="space-y-6">
                {/* Inline Form */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-white/50" />
                                </button>
                                
                                <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-accent-orange">
                                    {editingId ? 'Edit Release' : 'Add New Release'}
                                </h3>
                                
                                <form onSubmit={(e) => { e.preventDefault(); uploadMutation.mutate(); }} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Side: Title & Type/Date Grid */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Release Title</label>
                                                <input 
                                                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-orange/50 text-white"
                                                    placeholder="e.g. Neon Nights"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Type</label>
                                                    <select 
                                                        value={type} onChange={(e) => setType(e.target.value)}
                                                        className="w-full bg-black rounded-lg border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-orange/50 text-white"
                                                    >
                                                        <option value="Single">Single</option>
                                                        <option value="EP">EP</option>
                                                        <option value="Album">Album</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Release Date</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-orange/50 text-white"
                                                            placeholder="e.g. 2024"
                                                        />
                                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Spotify Link */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Spotify Link</label>
                                            <div className="relative">
                                                <input 
                                                    type="url" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-accent-orange/50 text-white placeholder:text-white/10"
                                                    placeholder="https://open.spotify.com/album/..."
                                                />
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-orange" />
                                            </div>
                                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-2 ml-1">Optional: Link to Spotify store or artist page</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Cover Art</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                                                    selectedFile ? "border-accent-orange bg-accent-orange/5" : "border-white/10 hover:border-white/20 bg-white/5"
                                                }`}
                                            >
                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                                <Upload className="w-6 h-6 text-white/20" />
                                                <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                                                    {selectedFile ? 'Change Cover Art' : 'Upload Cover Art'}
                                                </span>
                                            </div>
                                        </div>

                                        {previewUrl && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="relative aspect-square w-32 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                                            >
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                                                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={uploadMutation.isPending}
                                            className="px-8 py-3 rounded-xl bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {uploadMutation.isPending ? "Saving..." : (editingId ? "Update Release" : "Add Release")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                       
                    )}
                   
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {loading ? (
                        <div className="col-span-full p-24 text-center">
                             <div className="w-12 h-12 border-4 border-accent-orange/20 border-t-accent-orange rounded-full animate-spin mx-auto mb-4" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing Discography...</span>
                        </div>
                    ) : releases.length === 0 ? (
                        <div className="col-span-full p-24 border-2 border-dashed border-white/5 rounded-3xl text-center">
                            <Disc className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">No releases found</span>
                        </div>
                    ) : (
                        releases.map((item) => (
                            <motion.div 
                                key={item.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative flex items-center"
                            >
                                {/* Vinyl Disc - Animated */}
                                <div className="absolute right-0 w-48 h-48 rounded-full bg-[#111] border-[10px] border-black shadow-2xl transition-all duration-700 group-hover:right-[-40px] group-hover:rotate-180 flex items-center justify-center overflow-hidden z-0">
                                    <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-2 h-2 rounded-full bg-accent-orange shadow-[0_0_10px_#FF5722]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Album Cover Card */}
                                <div className="relative z-10 w-full bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent-orange/50 transition-all duration-500 shadow-2xl flex flex-col md:flex-row">
                                    <div className="relative w-full md:w-48 aspect-square shrink-0 overflow-hidden">
                                        {item.img_url ? (
                                            <img 
                                                src={item.img_url} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                alt={item.title} 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                <Disc className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/70">
                                            {item.type}
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col justify-center relative">
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 group-hover:text-accent-orange transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                                                Released {item.release_date ? new Date(item.release_date).getFullYear() : 'TBA'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {item.spotify_url && (
                                                <a 
                                                    href={item.spotify_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all border border-green-500/20"
                                                >
                                                    Listen on Spotify
                                                </a>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-accent-orange hover:text-white transition-all"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Releases;