"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Camera, Trash2, Maximize2, X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';

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

interface GalleryAsset {
    id: string;
    images: string;
    title: string;
   
}


const Gallery = () => {
    const [images, setImages] = useState<GalleryAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchImages = async () => {
        setLoading(true);
        // Try fetching from 'steve_monite_gallery' first (user's preferred table)
        let { data, error } = await supabase
            .from('steve_monite_gallery')
            .select('*')
            .order('created_at', { ascending: false });
        
        // If that fails or is empty, try the original 'media' table
        if (error || !data || data.length === 0) {
            const { data: mediaData, error: mediaError } = await supabase
                .from('media')
                .select('*')
                
                .order('created_at', { ascending: false });
            
            if (!mediaError && mediaData) {
                data = mediaData;
            } else if (error) {
                console.error('Error fetching images:', error);
            }
        }

        if (data) {
            // Map data to ensure 'images' property exists regardless of column name
            const normalizedData = data.map((item: any) => ({
                ...item,
                images: item.images || item.image || item.url || item.thumbnail
            }));
            setImages(normalizedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleDelete = async (id: string) => {
        // Try deleting from both possible tables
        await supabase.from('steve_monite_gallery').delete().eq('id', id);
        await supabase.from('media').delete().eq('id', id);
        fetchImages();
    };

    const uploadMutation = useMutation({
        mutationFn: async ({ file, title }: { file: File, title: string }) => {
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
            const filePath = `public/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('steve_monite_uploads')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('steve_monite_uploads')
                .getPublicUrl(filePath);

            // 3. Insert into database (attempt both for safety)
            const payload = {
                images: publicUrl,
               
                title: title || file.name,
                   
            };

            const { error: dbError } = await supabase.from('steve_monite_gallery').insert(payload);
            
            // If primary table fails, try 'media'
            if (dbError) {
                const { error: mediaError } = await supabase.from('media').insert(payload);
                if (mediaError) throw mediaError;
            }

            return publicUrl;
        },
        onSuccess: () => {
            fetchImages();
            setIsUploadModalOpen(false);
            setUploadTitle("");
            setSelectedFile(null);
            setPreviewUrl(null);
        },
        onError: (error: any) => {
            alert(`Upload failed: ${error.message || 'Unknown error'}`);
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            if (!uploadTitle) setUploadTitle(file.name.split('.')[0]);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            uploadMutation.mutate({ file: selectedFile, title: uploadTitle });
        }
    };

    return (
        <Card title="Photo Gallery Assets" action={
            <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
                <Plus className="w-3 h-3" /> Add Image
            </button>
        }>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(loading || uploadMutation.isPending) && images.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-white/20 uppercase tracking-[0.3em] font-black animate-pulse">Loading gallery...</div>
                ) : images.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-white/20 uppercase tracking-[0.3em] font-black italic">No images found</div>
                ) : (
                    images.map((item) => (
                        <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass border border-white/10 hover:border-accent-orange transition-all duration-500 shadow-2xl"
                        >
                            <Image
                                src={item.images} 
                                fill
                                quality={100}
                            
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-all duration-700 group-hover:scale-110" 
                                alt={item.title || "Gallery image"} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 truncate text-white">{item.title || 'Untitled'}</span>
                                <div className="flex gap-3">
                                   <button className="flex-1 py-3 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-black hover:bg-accent-orange hover:text-white transition-all">View Full</button>
                                   <button onClick={() => handleDelete(item.id)} className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500 text-white transition-all backdrop-blur-md"><Trash2 className="w-4 h-4" /></button>
                                </div>
                             </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 custom-scrollbar">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="fixed inset-0 cursor-pointer"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl shadow-2xl flex flex-col my-auto"
                        >
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                                <h3 className="text-xs font-black uppercase tracking-widest">Upload New Asset</h3>
                                <button 
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-white/50" />
                                </button>
                            </div>

                            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Asset Title</label>
                                    <input 
                                        type="text" 
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="Enter image title..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-orange/50 transition-all placeholder:text-white/20 text-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Image File</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                                                selectedFile 
                                                ? "border-accent-orange/50 bg-accent-orange/5" 
                                                : "border-white/10 hover:border-white/20 bg-white/5"
                                            }`}
                                        >
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                            <div className="text-center">
                                                <p className="text-[10px] text-white/40 font-medium">
                                                    {selectedFile ? 'Change Selected Image' : 'Click to browse or drag and drop'}
                                                </p>
                                                <p className="text-[9px] text-white/20 uppercase mt-1">PNG, JPG, WEBP up to 5MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {previewUrl && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative aspect-square w-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
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

                                <button 
                                    type="submit"
                                    disabled={!selectedFile || uploadMutation.isPending}
                                    className="w-full py-4 rounded-xl bg-accent-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-3"
                                >
                                    {uploadMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Upload Asset
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}


            </AnimatePresence>
        </Card>
    );
};

export default Gallery;
