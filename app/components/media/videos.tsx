"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Video, Edit3, Trash2, Play, X, Upload, Camera, Link as LinkIcon, ExternalLink, FileVideo } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import type ReactPlayerType from 'react-player';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

interface VideoAsset {
    id: string;
    video_url?: string;
    video?: string;
    url?: string;
    title: string;
    thumbnail: string;
    category: string;
    subtitle: string;
    created_at: string;
}

// Helper to check if a URL is a direct video file
const isDirectVideoFile = (url: string) => {
    if (!url) return false;
    // Check extension or Supabase public storage patterns
    const isSupabase = url.includes('.supabase.co/storage/v1/object/public/');
    const hasExtension = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
    return isSupabase || hasExtension;
};


const Videos = () => {
    const [videos, setVideos] = useState<VideoAsset[]>([]);
    const [loading, setLoading] = useState(false);
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState<VideoAsset | null>(null);
    const [isPlayerLoading, setIsPlayerLoading] = useState(true);
    const [uploadType, setUploadType] = useState<'link' | 'file'>('link');
    
    // Form State
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("Official Video");
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
    const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const fetchVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data) setVideos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVideos();
        return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
        };
    }, [thumbnailPreview]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        const { error } = await supabase.from('videos').delete().eq('id', id);
        if (!error) fetchVideos();
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            let thumbnailUrl = "";
            let finalVideoUrl = url;

            // 1. Upload Thumbnail if exists
            if (selectedThumbnail) {
                const fileName = `thumbnails/${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('steve_monite_uploads')
                    .upload(`public/${fileName}`, selectedThumbnail);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('steve_monite_uploads')
                    .getPublicUrl(`public/${fileName}`);
                
                thumbnailUrl = publicUrl;
            }

            // 2. Upload Video File if selected
            if (uploadType === 'file' && selectedVideoFile) {
                const fileName = `videos/${Math.random().toString(36).substring(2)}-${Date.now()}-${selectedVideoFile.name}`;
                const { error: videoError } = await supabase.storage
                    .from('steve_monite_uploads')
                    .upload(`public/${fileName}`, selectedVideoFile);

                if (videoError) throw videoError;

                const { data: { publicUrl } } = supabase.storage
                    .from('steve_monite_uploads')
                    .getPublicUrl(`public/${fileName}`);
                
                finalVideoUrl = publicUrl;
            }

            if (!finalVideoUrl) throw new Error("Please provide a link or upload a video file");

            const { error: dbError } = await supabase.from('videos').insert({
                title,
                url: finalVideoUrl,
                video_url: finalVideoUrl,
                category,
                thumbnail: thumbnailUrl,
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

    // Reset player loading state when active video changes
    useEffect(() => {
        if (activeVideo) {
            setIsPlayerLoading(true);
            // Fallback: if video hasn't loaded in 5 seconds, remove spinner anyway
            const timer = setTimeout(() => setIsPlayerLoading(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [activeVideo]);

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setCategory("Official Video");
        setSelectedThumbnail(null);
        setSelectedVideoFile(null);
        setThumbnailPreview(null);
        setUploadType('link');
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
                                            {isDirectVideoFile(item.video_url || item.url || item.video || "") ? <FileVideo className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                                            <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[200px]">
                                                {item.video_url || item.url || item.video || 'No source found'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setActiveVideo(item)}
                                            className="p-3 rounded-2xl bg-accent-orange text-white transition-all border border-accent-orange/20 group/play"
                                        >
                                            <Play className="w-4 h-4 fill-current group-hover/play:scale-110 transition-transform" />
                                        </button>
                                        <a 
                                            href={item.video_url || item.url || item.video} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
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
                            {isPlayerLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
                                    <div className="w-12 h-12 border-4 border-accent-orange/20 border-t-accent-orange rounded-full animate-spin mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Broadcasting...</p>
                                </div>
                            )}

                            {isDirectVideoFile(activeVideo.video_url || activeVideo.url || activeVideo.video || "") ? (
                                <video 
                                    src={activeVideo.video_url || activeVideo.url || activeVideo.video}
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    onLoadedData={() => setIsPlayerLoading(false)}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <ReactPlayer 
                                    key={activeVideo.id}
                                    url={activeVideo.video_url || activeVideo.url || activeVideo.video || ""}
                                    controls
                                    playing={true}
                                    muted={true}
                                    playsinline={true}
                                    onReady={() => setIsPlayerLoading(false)}
                                    width="100%"
                                    height="100%"
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                />
                            )}
                        </motion.div>
                        
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
                            className="relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
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
                                            className="w-full rounded-lg bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-orange transition-all text-white appearance-none cursor-pointer"
                                        >
                                            <option value="Official Video">Official Video</option>
                                            <option value="Live Performance">Live Performance</option>
                                            <option value="Behind the Scenes">Behind the Scenes</option>
                                            <option value="Interview">Interview</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5">
                                        <button 
                                            type="button"
                                            onClick={() => setUploadType('link')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'link' ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <LinkIcon className="w-4 h-4" /> External Link
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setUploadType('file')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'file' ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <Upload className="w-4 h-4" /> File Upload
                                        </button>
                                    </div>

                                    {uploadType === 'link' ? (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Source URL (YouTube/Vimeo)</label>
                                            <div className="relative">
                                                <input 
                                                    type="url" required={uploadType === 'link'} value={url} onChange={(e) => setUrl(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:border-accent-orange transition-all text-white placeholder:text-white/10"
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-orange" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Video File</label>
                                            <div 
                                                onClick={() => videoInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-500 ${
                                                    selectedVideoFile ? "border-accent-orange bg-accent-orange/5" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                                                }`}
                                            >
                                                <input type="file" ref={videoInputRef} onChange={(e) => e.target.files?.[0] && setSelectedVideoFile(e.target.files[0])} className="hidden" accept="video/*" />
                                                {selectedVideoFile ? (
                                                    <>
                                                        <FileVideo className="w-8 h-8 text-accent-orange" />
                                                        <div className="text-center">
                                                            <span className="block text-xs font-black uppercase tracking-widest text-white">{selectedVideoFile.name}</span>
                                                            <span className="text-[10px] font-bold text-accent-orange uppercase tracking-widest mt-1">Video selected</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-white/20" />
                                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Select Video File</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Thumbnail Cover</label>
                                        <div 
                                            onClick={() => thumbnailInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 ${
                                                selectedThumbnail ? "border-accent-orange bg-accent-orange/5" : "border-white/5 hover:border-white/10 bg-white/[0.02]"
                                            }`}
                                        >
                                            <input 
                                                type="file" 
                                                ref={thumbnailInputRef} 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setSelectedThumbnail(file);
                                                        const url = URL.createObjectURL(file);
                                                        setThumbnailPreview(url);
                                                    }
                                                }} 
                                                className="hidden" 
                                                accept="image/*" 
                                            />
                                            <Upload className="w-8 h-8 text-white/20" />
                                            <div className="text-center">
                                                <span className="block text-xs font-black uppercase tracking-widest text-white/40">
                                                    {selectedThumbnail ? 'Change Thumbnail' : 'Drop Thumbnail Here'}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">JPG, PNG up to 10MB</span>
                                            </div>
                                        </div>
                                    </div>

                                    {thumbnailPreview && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative aspect-video w-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                        >
                                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setThumbnailPreview(null); setSelectedThumbnail(null); }}
                                                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-md"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    )}
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
