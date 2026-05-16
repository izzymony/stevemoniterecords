"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Music, ArrowRight, Disc, Award, Users, Globe, Mail, Link as LinkIcon, X, FileVideo, ExternalLink } from "lucide-react";
import { FaInstagram, FaFacebook, FaSpotify } from 'react-icons/fa6';
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import { supabase } from "@/lib/supabaseClient";
import dynamic from 'next/dynamic';
import type ReactPlayerType from 'react-player';
import IntroScreen from './components/IntroScreen';
import BackgroundMusic from './components/backgrounMusic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

import { cn } from "@/lib/utils";

interface Release {
    id: string;
    title: string;
    type: string;
    release_date: string;
    img_url: string;
    spotify_url: string;
}

interface Video {
    id: string;
    title: string;
    video_url: string;
    thumbnail: string;
    category?: string;
    url?: string;
}

interface GalleryItem {
    id: string;
   images: string;
   title: string;
}

// Helper to check if a URL is a direct video file
const isDirectVideoFile = (url: string) => {
  if (!url) return false;
  const isSupabase = url.includes('.supabase.co/storage/v1/object/public/');
  const hasExtension = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
  return isSupabase || hasExtension;
};

export default function Home() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);

  // Video Lightbox State
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Releases
      const { data: releasesData } = await supabase
        .from('releases')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(6);
      
      // Fetch Videos - Using correct 'videos' table
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch Gallery
      const { data: galleryData } = await supabase
        .from('steve_monite_gallery')
        .select('*')
        .limit(12);
      
      if (releasesData) setReleases(releasesData);
      if (videosData) setVideos(videosData);
      if (galleryData) {
        setGallery(galleryData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Lock scroll when intro is active
  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [entered]);

  // Reset player loading state when active video changes
  useEffect(() => {
    if (activeVideo) {
      setIsPlayerLoading(true);
      const timer = setTimeout(() => setIsPlayerLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeVideo]);

  return (
    <main className="relative flex flex-col w-full">
      <IntroScreen entered={entered} onEnter={() => setEntered(true)} />
      <BackgroundMusic play={entered} />
      
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Alt-Image-1-S.webp"
            alt="Afrobuggy Artist Hero"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Afrobuggy Pioneer
            </span>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              STEVE <br />
              <span className="text-gradient-orange">MONITE</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-white/70 font-medium mb-10 leading-relaxed">
              Redefining the rhythm of the continent. Experience the cinematic energy of Afroboggie music — where culture meets the future.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="#releases"
                className="group relative px-8 py-4 rounded-full bg-accent-orange text-white font-bold uppercase tracking-widest flex items-center gap-3 overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <Play className="w-5 h-5 fill-current" />
                Listen Now
              </Link>
              <Link
                href="#videos"
                className="px-8 py-4 rounded-full glass text-white font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300"
              >
                Watch Videos
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent-orange to-transparent" />
        </motion.div>
      </section>

      {/* 2. LATEST RELEASES */}
      <Section id="releases" className="relative overflow-hidden bg-black">
  {/* Ambient Background Glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-[10%] top-0 h-[400px] w-[400px] rounded-full bg-accent-orange/10 blur-[120px]" />
    <div className="absolute bottom-0 right-[10%] h-[400px] w-[400px] rounded-full bg-accent-purple/10 blur-[120px]" />
  </div>

  {/* Header */}
  <div className="relative z-10 mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div>
      <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-accent-purple">
        New Sound
      </span>

      <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
        Latest Releases
      </h2>
    </div>

    <Link
      href="#"
      className="group flex items-center gap-3 text-white/50 transition-all duration-300 hover:text-accent-orange"
    >
      <span className="text-xs font-black uppercase tracking-[0.25em]">
        View Discography
      </span>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 group-hover:border-accent-orange/30 group-hover:bg-accent-orange/10">
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  </div>

  {/* Grid */}
  <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
    {loading ? (
      <div className="col-span-full py-24 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent-orange/20 border-t-accent-orange" />

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          Syncing Discography...
        </span>
      </div>
    ) : releases.length === 0 ? (
      <div className="col-span-full rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] py-24 text-center backdrop-blur-xl">
        <Disc className="mx-auto mb-4 h-12 w-12 text-white/10" />

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
          No releases found
        </span>
      </div>
    ) : (
      releases.map((release, i) => (
        <motion.div
          key={release.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.08 }}
          className="group relative overflow-hidden rounded-[2.7rem]"
        >
          {/* Glow Layer */}
          <div className="absolute -inset-[1px] rounded-[2.7rem] bg-gradient-to-br from-accent-orange/30 via-accent-purple/20 to-transparent opacity-60 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:blur-3xl" />

          {/* Main Card */}
          <div className="relative aspect-square overflow-hidden rounded-[2.7rem] border border-white/10 bg-[#0B0B0B] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={release.img_url}
                alt={release.title}
                width={500}
                height={500}
                className="h-full w-full object-cover scale-105 transition-transform duration-[1400ms] group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Cinematic Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-transparent to-accent-purple/10 opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
            </div>

            {/* Floating Ambient Light */}
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-accent-orange/20 blur-3xl opacity-50 transition-all duration-700 group-hover:opacity-100" />

            {/* Content */}
            <div className="relative z-20 flex h-full flex-col justify-between p-8">

              {/* Top Meta */}
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[8px] font-black uppercase tracking-[0.25em] text-white/70 backdrop-blur-md">
                  {release.type}
                </span>

                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                  {release.release_date
                    ? new Date(release.release_date).getFullYear()
                    : "2024"}
                </span>
              </div>

              {/* Bottom Content */}
              <div>

                {/* Title */}
                <div className="mb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                    {release.title}
                  </h3>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                    Steve Monite
                  </p>
                </div>

                {/* CTA */}
                {release.spotify_url ? (
                  <Link
                    href={release.spotify_url}
                    className="group/play flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl transition-all duration-500 hover:border-accent-orange/30 hover:bg-accent-orange/10"
                  >
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                        Listen Now
                      </span>

                      <span className="mt-1 block text-sm font-semibold text-white">
                        Stream Release
                      </span>
                    </div>

                    {/* Play Button */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-orange via-[#ff7a18] to-accent-purple shadow-[0_0_35px_rgba(255,120,50,0.45)] transition-all duration-500 group-hover/play:scale-110">
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />

                      <Play className="relative z-10 ml-1 h-5 w-5 fill-current text-white" />
                    </div>
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30 backdrop-blur-xl">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>

            {/* Border Highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.7rem] border border-white/5 transition-colors duration-700 group-hover:border-accent-orange/20" />
          </div>
        </motion.div>
      ))
    )}
  </div>
</Section>
      {/* 3. ABOUT THE ARTIST */}
      <Section id="about" className="bg-[#080808] relative overflow-hidden py-32">
        {/* Large Background Text */}
        <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter">
          Origins
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative z-10">
          {/* Editorial Image Side - Sticky for better flow */}
          <div className="relative order-2 lg:order-1 lg:sticky lg:top-32">
            <div className="absolute -top-10 -left-10 w-full h-full border border-accent-orange/20 rounded-[3rem] z-0" />
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden glass border border-white/10 z-10 shadow-2xl"
            >
              <Image
                src="/Alt-Image-1-S.webp"
                alt="Artist Portrait"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Floating Accent Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-8 p-8 rounded-3xl glass-dark border border-white/10 shadow-2xl z-20 max-w-[200px]"
            >
              <span className="text-3xl font-black text-accent-orange block mb-2">Benin</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">City Roots to Global Stages</span>
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  The Journey
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                  Crafting the <br />
                  <span className="text-gradient-orange">Afro-Boogie</span> <br />
                  Sound
                </h2>
              </div>

              {/* Scrollable Narrative Container */}
              <div className="relative group">
                <div className="max-h-[500px] overflow-y-auto scrollbar-hide pr-8 space-y-6 text-white/60 text-lg font-medium leading-relaxed custom-scrollbar " style={{scrollbarWidth: "none"}}>
                  <p className="first-letter:text-6xl first-letter:font-black first-letter:text-accent-orange first-letter:mr-3 first-letter:float-left first-letter:mt-2">
                    My journey into music did not begin with a record deal or a studio session. It began in the pews of an Anglican church on Ozah Street in Benin City, where, as a young boy, I learned the power of listening. Sunday after Sunday, we were taught not only how to sing, but also how to write songs — though at the time, most of them were rooted in gospel and religious music.
                  </p>
                  <p>
                    In those days, Benin City was a melting pot of sounds, and being part of the choir gave me a front-row seat to the intricate harmonies and rhythmic complexities of African gospel. We weren&apos;t just performers; we were students of melody. This spiritual foundation became the bedrock of my musical identity, even as I eventually branched out to create what is now known as Afro-Boogie.
                  </p>
                  <p>
                    By 1979, restless and unwilling to settle into a regular nine-to-five life, I began recording demonstration tapes and sending them to record companies across the country. Rejections came often. Some told me I needed to improve. Others said nothing at all. But rejection only strengthened my determination.
                  </p>
                  <p>
                    I spent the following years refining my craft before eventually travelling to London, where I connected with producers and musicians who, like me, were searching for their own breakthrough. One of those collaborators was Herman Asafo-Agyei — the Ghanaian bassist, singer, and bandleader who was balancing his musical ambitions alongside a law degree at the time.
                  </p>
                  <p>
                    Between 1982 and 1984, we worked together on demos that I carried from Nigeria to London, knocking on doors and searching for an opportunity. Eventually, one of those doors opened. Chief Tony Okoroji, working through EMI Records, heard my music and was captivated by the sound.
                  </p>
                  <p>
                    “When Tony Okoroji first heard the music, he decided to sign me to EMI as an artiste,” I recalled. “And that was the beginning for me.” That moment marked the true start of a journey that would shape my identity, my sound, and my place in music history.
                  </p>
                </div>
                {/* Subtle Bottom Fade to indicate more text */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
              </div>

              {/* Pillar Stats */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div>
                  <span className="text-2xl font-black text-white block">20+ YRS</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Musical Innovation</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-white block">100%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Pure Afro-Boogie</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* 5. MEDIA (VIDEOS) */}
      <Section id="videos" className="bg-[#050505]">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent-orange font-bold uppercase tracking-widest text-sm mb-4 block">Behind the Sound</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Studio Sessions</h2>
          </div>
          <Link href="/videos" className="flex items-center gap-2 text-white/60 hover:text-accent-orange transition-colors group">
            <span className="font-bold uppercase tracking-widest text-xs">Watch All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-video rounded-[2.5rem] overflow-hidden glass border border-white/5 cursor-pointer shadow-2xl"
              onClick={() => setActiveVideo(video)}
            >
              <Image
                src={video.thumbnail} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                alt={video.title} 
                fill
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-500" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-accent-orange/90 text-white flex items-center justify-center scale-90 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(255,87,34,0.4)]">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{video.title}</h3>
                  <div className="flex items-center gap-2 text-white/40 mt-1">
                    {isDirectVideoFile(video.video_url || video.url || "") ? <FileVideo className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                    {/* <span className="text-[8px] font-bold uppercase tracking-widest">
                      {video.video_url || video.url || 'Studio Visual'}
                    </span> */}
                  </div>
                </div>
                <Link
                  href={video.video_url || video.url || ''} 

                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className=""
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 6. GALLERY */}
      <Section id="gallery" className="bg-black py-32 overflow-hidden">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent-orange font-bold uppercase tracking-widest text-sm mb-4 block">Visual Archive</span>
            <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter">Photo Gallery</h2>
          </div>
          <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-12 h-[1px] bg-white/10" />
            Moments in Time
          </div>
        </div>

        {/* Professional Bento Grid System */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4 md:gap-6 group/gallery">
          {gallery.map((item, i) => {
            // Unique spanning logic for a professional architectural look
            const isLarge = i === 0 || i === 7;
            const isTall = i === 2 || i === 5 || i === 10;
            const isWide = i === 1 || i === 8;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative rounded-[2rem] overflow-hidden glass border border-white/5 transition-all duration-700 group cursor-pointer",
                  isLarge && "md:col-span-2 md:row-span-2",
                  isTall && "md:row-span-2",
                  isWide && "md:col-span-2",
                  "hover:z-20 hover:border-accent-orange/50 hover:shadow-[0_0_50px_rgba(255,87,34,0.15)]",
                  "group-hover/gallery:opacity-50 hover:!opacity-100" // Spotlight effect
                )}
              >
                <Image
                  src={item.images} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                  alt={item.title || "Gallery"} 
                  fill
                />
                
                {/* Minimalist Glass Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <div className="glass-dark border border-white/10 px-4 py-2 rounded-xl backdrop-blur-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent-orange block mb-1">Archive {String(i + 1).padStart(2, '0')}</span>
                    <h4 className="text-xs font-bold text-white uppercase truncate max-w-[150px]">{item.title || "Untitled Moment"}</h4>
                  </div>
                </div>

                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none group-hover:border-accent-orange/20 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </Section>
      {/* 7. EVENTS */}
      <Section id="events" className="bg-[#0a0a0a]">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-accent-gold font-bold uppercase tracking-widest text-sm mb-4 block">Live Tours</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Upcoming Shows</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <button className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className='text-white text-8xl font-black uppercase tracking-tighter'>COMING SOON</h1>
        </div>
      </Section>
      {/* 8. SOCIAL & FAN ENGAGEMENT */}
      <Section id="social" className="bg-black">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-accent-purple font-bold uppercase tracking-widest text-sm mb-4">Community</span>
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Join the Movement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              platform: "Instagram", 
              handle: "@stevemoniteofficial", 
              href: 'https://www.instagram.com/stevemoniteofficial/', 
              followers: "850K", 
              color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
              icon: <FaInstagram className="w-8 h-8 text-white" />
            },
            { 
              platform: "Spotify", 
              handle: "Steve Monite", 
              href: 'https://open.spotify.com/artist/stevemonite', 
              followers: "120K Monthly", 
              color: "bg-[#1DB954]",
              icon: <FaSpotify className="w-8 h-8 text-white" />
            },
            { 
              platform: "Facebook", 
              handle: "Steve Monite", 
              href: 'https://facebook.com/stevemonite', 
              followers: "200K", 
              color: "bg-[#1877F2]",
              icon: <FaFacebook className="w-8 h-8 text-white" />
            },
            { 
              platform: "DistroKid", 
              handle: "Stream Everywhere", 
              href: 'https://distrokid.com/hyperfollow/stevemonite', 
              followers: "Listen Now", 
              color: "bg-black border border-white/20",
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm-2-7h4v2h-4v-2z" />
                </svg>
              )
            },
          ].map((social) => (
            <Link key={social.platform} href={social.href} target="_blank" className="block outline-none">
              <motion.div
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl glass border border-white/5 flex flex-col items-center text-center group cursor-pointer h-full"
              >
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", social.color)}>
                  {social.icon}
                </div>
                <h3 className="text-xl font-black uppercase mb-1">{social.platform}</h3>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-4">{social.handle}</p>
                <span className="text-2xl font-black text-accent-orange">{social.followers}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 9. CONTACT / BOOKINGS */}
      <Section id="contact" className="bg-[#050505] py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12 leading-[0.9]">Let's <br /><span className="text-gradient-purple">Connect</span></h2>
            <div className="space-y-8 mb-16">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:bg-accent-purple group-hover:text-white transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest block">Management</span>
                  <span className="text-xl font-bold">bookings@stevemonite.com</span>
                </div>
              </div>
            </div>

            <div className="p-12 rounded-3xl glass border border-white/10 bg-gradient-to-br from-accent-purple/5 to-transparent">
              <h4 className="text-2xl font-black uppercase mb-6">Join the Inner Circle</h4>
              <p className="text-white/60 mb-8 font-medium">Get exclusive access to pre-releases, secret shows, and limited edition drops.</p>
              <div className="flex gap-4">
                <input type="email" placeholder="YOUR EMAIL" className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-bold outline-none focus:border-accent-purple transition-all" />
                <button className="px-8 py-4 rounded-full bg-accent-purple text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">Join</button>
              </div>
            </div>
          </div>

          <div className="glass-dark p-12 rounded-[4rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/10 blur-[100px] -z-10" />
            <h3 className="text-3xl font-black uppercase mb-12">Booking Inquiry</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 ml-4">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-accent-orange" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40 ml-4">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-accent-orange" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 ml-4">Inquiry Type</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-accent-orange appearance-none">
                  <option>Festival / Arena Performance</option>
                  <option>Private Event</option>
                  <option>Brand Collaboration</option>
                  <option>Press / Interview</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 ml-4">Tell us about the project</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-accent-orange resize-none"></textarea>
              </div>
              <button className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-accent-orange hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">Send Inquiry</button>
            </form>
          </div>
        </div>
      </Section>

      {/* 10. FOOTER */}
      <footer className="bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent-orange mb-6">
              <Image
                src="/WhatsApp Image 2026-05-12 at 10.02.23.jpeg"
                alt="Steve Monite"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-3xl font-black uppercase tracking-tighter">STEVE MONITE</span>
            <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] mt-2 uppercase">© 2026 AFRO-BOOGIE RECORDS. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex gap-12 text-center md:text-left">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Explore</span>
              <Link href="#releases" className="text-sm font-bold hover:text-accent-orange transition-colors">DISCOGRAPHY</Link>
              <Link href="#videos" className="text-sm font-bold hover:text-accent-orange transition-colors">VISUALS</Link>
              <Link href="#events" className="text-sm font-bold hover:text-accent-orange transition-colors">TOUR</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Legal</span>
              <Link href="#" className="text-sm font-bold hover:text-accent-orange transition-colors">PRIVACY</Link>
              <Link href="#" className="text-sm font-bold hover:text-accent-orange transition-colors">TERMS</Link>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Social Icon buttons could go here */}
          </div>
        </div>
      </footer>

      {/* Video Player Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          >
            <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white/50 hover:text-white">
              <X className="w-10 h-10" />
            </button>
            <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden relative bg-black shadow-2xl">
              {isPlayerLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
                  <div className="w-12 h-12 border-4 border-accent-orange/20 border-t-accent-orange rounded-full animate-spin" />
                </div>
              )}
              {isDirectVideoFile(activeVideo.video_url || activeVideo.url || "") ? (
                <video 
                  src={activeVideo.video_url || activeVideo.url} 
                  controls autoPlay muted playsInline 
                  onLoadedData={() => setIsPlayerLoading(false)} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <ReactPlayer 
                  key={activeVideo.id} 
                  url={activeVideo.video_url || activeVideo.url || ""} 
                  controls playing muted playsinline 
                  onReady={() => setIsPlayerLoading(false)} 
                  width="100%" height="100%" 
                  style={{ position: 'absolute', top: 0, left: 0 }} 
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}