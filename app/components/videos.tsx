"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Video, Edit3, Trash2, Play, X, Upload, Camera, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';

interface VideoAsset {
    id: string;
    video?: string;
    url?: string;
    title: string;
    thumbnail?: string;
    category?: string;
    subtitle?: string;
    created_at?: string;
}

// Helper to convert standard video URLs to embed URLs
const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v\/|.*u\/\w\/|embed\/|watch\?v=))([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/|)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

    return url;
};

const Videos = () => {
    const [videos, setVideos] = useState<VideoAsset[]>([]);
    const [loading, setLoading] = useState(false);
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState<VideoAsset | null>(null);
    
    // Form State
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("Official Video");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('type', 'video')
            .order('created_at', { ascending: false });
        
        if (data) setVideos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        const { error } = await supabase.from('media').delete().eq('id', id);
        if (!error) fetchVideos();
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            let thumbnail = "";

            if (selectedFile) {
                const fileName = `thumbnails/${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('steve_monite_uploads')
                    .upload(`public/${fileName}`, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('steve_monite_uploads')
                    .getPublicUrl(`public/${fileName}`);
                
                thumbnail = publicUrl;
            }

            const { error: dbError } = await supabase.from('media').insert({
                title,
                url,
                video: url,
                category,
                thumbnail,
                type: 'video',
                subtitle: category
            });

            if (dbError) throw dbError;
        },
        onSuccess: () => {
            fetchVideos();
            setIsModalOpen(false);
            resetForm();
        },
        onError: (err: any) => {
            alert(`Error: ${err.message}`);
        }
    });

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setCategory("Official Video");
        setSelectedFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Music Videos</h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Manage your visual discography</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-orange/20"
                >
                    <Plus className="w-4 h-4" /> Add Video
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full p-24 text-center">
                         <div className="w-12 h-12 border-4 border-accent-orange/20 border-t-accent-orange rounded-full animate-spin mx-auto mb-4" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing catalog...</span>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="col-span-full p-24 border-2 border-dashed border-white/5 rounded-3xl text-center">
                        <Video className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">No videos in spotlight</span>
                    </div>
                ) : (
                    videos.map((item) => (
                        <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden hover:border-accent-orange/50 transition-all duration-500 shadow-2xl"
                        >
                            <div 
                                onClick={() => setActiveVideo(item)}
                                className="aspect-video relative overflow-hidden cursor-pointer"
                            >
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <Video className="w-8 h-8 text-white/10" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                                        <Play className="w-6 h-6 text-white fill-white" />
                                    </div>
                                </div>

                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/70">
                                    {item.category || item.subtitle || 'Video'}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div className="cursor-pointer" onClick={() => setActiveVideo(item)}>
                                        <h3 className="text-lg font-black uppercase tracking-tighter leading-none mb-2 hover:text-accent-orange transition-colors">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-white/30">
                                            <LinkIcon className="w-3 h-3" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[200px]">
                                                {item.url || item.video || 'No link provided'}
                                            </span>
                                        </div>
                                    </div>
                                    <a 
                                        href={item.url || item.video} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-white/5 hover:bg-accent-orange hover:text-white transition-all border border-white/5"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                    <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">Edit Details</button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Video Player Lightbox */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl"
                    >
                        <button 
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all z-[210]"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,87,34,0.15)] border border-white/10 relative bg-black"
                        >
                            <iframe 
                                src={getEmbedUrl(activeVideo.url || activeVideo.video || "") || ""}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                        
                        {/* Title Overlay in Lightbox */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                            <h2 className="text-xl font-black uppercase tracking-widest">{activeVideo.title}</h2>
                            <p className="text-[10px] font-bold text-accent-orange uppercase tracking-[0.3em] mt-2">{activeVideo.category}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-orange">Video Spotlight</h3>
                                    <p className="text-[14px] font-black uppercase tracking-tighter mt-1">Add New Visual Asset</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors group">
                                    <X className="w-5 h-5 text-white/30 group-hover:text-white" />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); uploadMutation.mutate(); }} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Video Title</label>
                                        <input 
                                            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-orange transition-all text-white placeholder:text-white/10"
                                            placeholder="e.g. Neon Nights - Official Music Video"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Category</label>
                                        <select 
                                            value={category} onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-orange transition-all text-white appearance-none cursor-pointer"
                                        >
                                            <option value="Official Video">Official Video</option>
                                            <option value="Live Performance">Live Performance</option>
                                            <option value="Behind the Scenes">Behind the Scenes</option>
                                            <option value="Interview">Interview</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Video Source URL</label>
                                    <div className="relative">
                                        <input 
                                            type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:border-accent-orange transition-all text-white placeholder:text-white/10"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-orange" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Thumbnail Cover</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 ${
                                            selectedFile ? "border-accent-orange bg-accent-orange/5" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                                        }`}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                        {selectedFile ? (
                                            <>
                                                <div className="w-16 h-16 rounded-2xl bg-accent-orange/20 flex items-center justify-center">
                                                    <Camera className="w-8 h-8 text-accent-orange" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-xs font-black uppercase tracking-widest text-white">{selectedFile.name}</span>
                                                    <span className="text-[10px] font-bold text-accent-orange uppercase tracking-widest mt-1">Ready to upload</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-white/20" />
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-xs font-black uppercase tracking-widest text-white/40">Drop Thumbnail Here</span>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">JPG, PNG up to 10MB</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={uploadMutation.isPending}
                                    className="w-full py-5 rounded-2xl bg-accent-orange text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-accent-orange/20"
                                >
                                    {uploadMutation.isPending ? "Broadcasting..." : "Publish Video"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Videos;
