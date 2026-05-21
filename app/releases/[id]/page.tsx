'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Disc, ExternalLink, Calendar, Music, Sparkles, AlertCircle, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  SiSpotify,
  SiApple,
  SiSoundcloud,
  SiItunes,
  SiTidal,
  SiBandcamp,

  SiYoutube,
} from "react-icons/si";

interface ReleaseId {
  id: string;
  img_url: string;
  type: string;
  title: string;
  release_date: string;
  release_id: {
    id: string;
    platform: string;
    url: string;
  }[];
}

const platformDetails: {
  [key: string]: {
    color: string;
    Icon: React.ComponentType<{ className?: string }>;
    hoverColor: string;
    textColor: string;
    accentBg: string;
    buttonText: string;
  }
} = {
  "Spotify": {
    color: "border-[#1DB954]/20 hover:border-[#1DB954]/60",
    Icon: SiSpotify,
    hoverColor: "hover:bg-[#1DB954]/10",
    textColor: "text-[#1DB954]",
    accentBg: "bg-[#1DB954]",
    buttonText: "PLAY"
  },
  "Apple Music": {
    color: "border-[#FC3C44]/20 hover:border-[#FC3C44]/60",
    Icon: SiApple,
    hoverColor: "hover:bg-[#FC3C44]/10",
    textColor: "text-[#FC3C44]",
    accentBg: "bg-[#FC3C44]",
    buttonText: "STREAM"
  },
  "YouTube": {
    color: "border-[#FF0000]/20 hover:border-[#FF0000]/60",
    Icon: SiYoutube,
    hoverColor: "hover:bg-[#FF0000]/10",
    textColor: "text-[#FF0000]",
    accentBg: "bg-[#FF0000]",
    buttonText: "WATCH"
  },
  "SoundCloud": {
    color: "border-[#FF5500]/20 hover:border-[#FF5500]/60",
    Icon: SiSoundcloud,
    hoverColor: "hover:bg-[#FF5500]/10",
    textColor: "text-[#FF5500]",
    accentBg: "bg-[#FF5500]",
    buttonText: "LISTEN"
  },
 
  "Tidal": {
    color: "border-[#00FFFF]/20 hover:border-[#00FFFF]/60",
    Icon: SiTidal,
    hoverColor: "hover:bg-[#00FFFF]/10",
    textColor: "text-[#00FFFF]",
    accentBg: "bg-[#00FFFF]",
    buttonText: "PLAY"
  },
  "Bandcamp": {
    color: "border-[#629AA9]/20 hover:border-[#629AA9]/60",
    Icon: SiBandcamp,
    hoverColor: "hover:bg-[#629AA9]/10",
    textColor: "text-[#629AA9]",
    accentBg: "bg-[#629AA9]",
    buttonText: "BUY"
  }
 
}

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [releaseData, setReleaseData] = useState<ReleaseId | null>(null)
  const [loading, setLoading] = useState(true)

  const { id } = use(params)

  const getReleasesLink = async (id: string) => {
    try {
      const { data, error } = await supabase.from('releases')
        .select('id, img_url, type, title, release_date, release_id( id, platform, url )')
        .eq("id", id)
        .single()


      if (error) {
        console.error("Error fetching release links:", error)
        return null;
      }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  useEffect(() => {
    setLoading(true)
    getReleasesLink(id).then(data => {
      setReleaseData(data as any)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-12 h-12 border-4 border-accent-orange/20 border-t-accent-orange rounded-full animate-spin mb-6" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 animate-pulse">Syncing Release Details...</span>
      </div>
    )
  }

  if (!releaseData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <AlertCircle className="w-16 h-16 text-red-500/50 mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Release Not Found</h2>
        <p className="text-sm text-white/40 max-w-sm mb-8">The release you are looking for might have been removed, deleted, or the link is incorrect.</p>
        <Link
          href="/steve_admin"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    )
  }

  const links = releaseData.release_id || []

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 md:px-8">

      {/* Ambient background blur of the artwork */}
      {releaseData.img_url && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-[120px] opacity-15 pointer-events-none scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${releaseData.img_url})` }}
        />
      )}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-orange/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl relative z-10">

        {/* Navigation & Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/steve_admin"
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent-orange animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/70">SmartLink Active</span>
          </div>
        </div>

        {/* Card Panel */}
        <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl glass-dark grid grid-cols-1 lg:grid-cols-12">

          {/* Left Panel: Cover & Basic Info */}
          <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col items-center lg:items-start justify-center relative overflow-hidden group">

            {/* Spinning Vinyl behind the cover (Desktop) */}
            <div className="absolute left-1/2 lg:left-auto lg:-right-12 top-8 lg:top-auto w-56 h-56 rounded-full bg-[#111] border-[10px] border-black shadow-2xl transition-all duration-700 -translate-x-1/2 lg:translate-x-0 group-hover:right-[-60px] group-hover:rotate-180 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
              <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-3 h-3 rounded-full bg-accent-orange shadow-[0_0_10px_#FF5722]" />
                </div>
              </div>
            </div>

            {/* Album Artwork Cover */}
            <div className="relative z-10 w-64 md:w-72 aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 group-hover:scale-[1.02] transition-all duration-500">
              {releaseData.img_url ? (
                <Image
                  src={releaseData.img_url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={releaseData.title}
                  fill
                  priority
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Disc className="w-16 h-16 text-white/10" />
                </div>
              )}
            </div>

            {/* Album Metadata */}
            <div className="relative z-10 text-center lg:text-left w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-[8px] font-black uppercase tracking-widest text-accent-orange">
                  {releaseData.type}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {releaseData.release_date ? new Date(releaseData.release_date).getFullYear() : 'TBA'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-3 text-white">
                {releaseData.title}
              </h1>

              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                STEVE MONITE RECORDS
              </p>
            </div>

          </div>

          {/* Right Panel: Platform Links */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-[#070707]/90 backdrop-blur-md">
            <div className="mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                STREAMING CHANNELS
              </h2>
              <p className="text-xs text-white/60 font-medium">Select your preferred music streaming service below to listen.</p>
            </div>

            {/* List of Platform Buttons */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {links.length === 0 ? (
                <div className="py-16 px-6 border border-dashed border-white/5 rounded-3xl text-center flex flex-col items-center justify-center">
                  <Music className="w-8 h-8 text-white/10 mb-4 animate-bounce" />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 italic mb-2">No streaming links listed yet</p>
                  <p className="text-[9px] font-medium text-white/30 uppercase tracking-wider max-w-[280px]">Configure platform links for this release in your dashboard.</p>
                </div>
              ) : (
                links.map((link) => {
                  const details = platformDetails[link.platform] || platformDetails["Other"]

                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border ${details.color} ${details.hoverColor} transition-all duration-300 group/link`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${details.textColor} bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:bg-white/10 transition-colors`}>
                          <details.Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-xs uppercase tracking-widest text-white group-hover/link:text-accent-orange transition-colors">
                            {link.platform}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                            Available Now
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black tracking-widest border border-white/10 rounded-full px-4 py-2 text-white/80 group-hover/link:border-white/30 group-hover/link:text-white transition-colors`}>
                          {details.buttonText}
                        </span>
                        <div className={`w-8 h-8 rounded-full ${details.accentBg} text-black flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-all duration-300 scale-75 group-hover/link:scale-100 shadow-[0_0_15px_rgba(255,255,255,0.15)]`}>
                          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </motion.a>
                  )
                })
              )}
            </div>

            {/* Footer Brand */}
            <div className="mt-10 pt-6 border-t border-white/5 text-center flex items-center justify-between text-[8px] font-black uppercase tracking-[0.25em] text-white/20">
              <span>© {new Date().getFullYear()} Steve Monite</span>
              <span>All Rights Reserved</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default page