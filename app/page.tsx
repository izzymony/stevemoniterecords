"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Music, ArrowRight, Disc, Award, Users, Globe, Mail } from "lucide-react";
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import { supabase } from "@/lib/supabaseClient";

import { cn } from "@/lib/utils";


export default function Home() {
  return (
    <main className="relative flex flex-col w-full">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Alt-Image-1-S.webp"
            alt="Afrobuggy Artist Hero"

            fill
            className=" object-cover  object-center  " /* brightness-75 grayscale-[20%] */
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
              Redefining the rhythm of the continent. Experience the cinematic energy of Afrobuggy music — where culture meets the future.
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
      <Section id="releases" className="bg-black">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent-purple font-bold uppercase tracking-widest text-sm mb-4 block">New Sound</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Latest Releases</h2>
          </div>
          <Link href="#" className="flex items-center gap-2 text-white/60 hover:text-accent-orange transition-colors group">
            <span className="font-bold uppercase tracking-widest text-xs">View Discography</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Neon Nights", type: "Single", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000", color: "from-accent-orange" },
            { title: "Buggy Wave", type: "Album", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000", color: "from-accent-purple" },
            { title: "Electric Soul", type: "EP", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000", color: "from-accent-gold" },
          ].map((release, i) => (
            <motion.div
              key={release.title}
              whileHover={{ y: -10 }}
              className="group relative aspect-square overflow-hidden rounded-3xl glass border border-white/5"
            >
              <Image
                src={release.img}
                alt={release.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />
              <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", release.color)} />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">{release.type}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">{release.title}</h3>
                <div className="flex gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <button className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button className="flex-1 rounded-full glass-dark text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                    Stream Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 3. ABOUT THE ARTIST */}
      <Section id="about" className="bg-[#080808]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass border border-white/10 order-2 lg:order-1">
            <Image
              src="/Alt-Image-1-S.webp"
              alt="Artist in studio"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-accent-gold font-bold uppercase tracking-widest text-sm mb-4 block">The Journey</span>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8">Crafting the <span className="text-accent-orange">Afro-Boogie</span> Sound</h2>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed mb-12">
              <p>
                My journey into music did not begin with a record deal or a studio session. It began in the pews of an Anglican church on Ozah Street in Benin City, where, as a young boy, I learned the power of listening. Sunday after Sunday, we were taught not only how to sing, but also how to write songs — though at the time, most of them were rooted in gospel and religious music.
              </p>
              <p>
                As I grew older, the sacred and the secular slowly began to separate for me. Music drifted into the background, replaced by the ambitions and realities of young adulthood in late-1970s Nigeria. But ambition, as it turned out, would eventually lead me right back to music.
              </p>
              <p>
                By 1979, restless and unwilling to settle into a regular nine-to-five life, I began recording demonstration tapes and sending them to record companies across the country. Rejections came often. Some told me I needed to improve. Others said nothing at all.
              </p>
              <p>
                But rejection only strengthened my determination. I knew there was something authentic in my sound — something unique. I spent the following years refining my craft before eventually travelling to London, where I connected with producers and musicians who, like me, were searching for their own breakthrough.
              </p>
              <p>
                One of those collaborators was Herman Asafo-Agyei — the Ghanaian bassist, singer, and bandleader who was balancing his musical ambitions alongside a law degree at the time. Between 1982 and 1984, we worked together on demos that I carried from Nigeria to London, knocking on doors and searching for an opportunity.
              </p>
              <p>
                Eventually, one of those doors opened. Chief Tony Okoroji, working through EMI Records, heard my music and was captivated by the sound. “When Tony Okoroji first heard the music, he decided to sign me to EMI as an artiste,” I recalled. “And that was the beginning for me.”
              </p>
              <p className="italic text-accent-orange font-medium">
                That moment marked the true start of a journey that would shape my identity, my sound, and my place in music.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Total Streams", val: "500M+", icon: Music },
                { label: "Collaborations", val: "50+", icon: Users },
                { label: "Awards Won", val: "12", icon: Award },
                { label: "Countries", val: "35+", icon: Globe },
              ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl glass border border-white/5">
                  <stat.icon className="w-6 h-6 text-accent-orange mb-4" />
                  <div className="text-3xl font-black mb-1">{stat.val}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 4. BRANDS & COLLABORATIONS */}
      <Section id="brands" className="bg-black py-12">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4 block">Trusted by Global Icons</span>
        </div>
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 items-center whitespace-nowrap"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-20 items-center">
                <span className="text-4xl md:text-6xl font-black text-white/10 hover:text-white/30 transition-colors cursor-default">BALENCIAGA</span>
                <span className="text-4xl md:text-6xl font-black text-white/10 hover:text-white/30 transition-colors cursor-default">VOGUE</span>
                <span className="text-4xl md:text-6xl font-black text-white/10 hover:text-white/30 transition-colors cursor-default">PUMA</span>
                <span className="text-4xl md:text-6xl font-black text-white/10 hover:text-white/30 transition-colors cursor-default">MONCLER</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* 5. MEDIA (VIDEOS & GALLERY) */}
      
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
          {[
            { city: "Lagos, Nigeria", venue: "Eko Atlantic Arena", date: "JUN 15, 2026", status: "Selling Fast" },
            { city: "London, UK", venue: "O2 Academy Brixton", date: "JUL 02, 2026", status: "Sold Out" },
            { city: "Accra, Ghana", venue: "Black Star Square", date: "JUL 18, 2026", status: "On Sale" },
            { city: "Paris, France", venue: "Accor Arena", date: "AUG 05, 2026", status: "Coming Soon" },
          ].map((event) => (
            <motion.div
              key={event.venue}
              whileHover={{ x: 20 }}
              className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl glass border border-white/5 hover:border-accent-orange/50 transition-all duration-500 group"
            >
              <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                <span className="text-2xl md:text-4xl font-black uppercase tracking-tighter group-hover:text-accent-orange transition-colors">{event.city}</span>
                <span className="text-white/40 font-bold uppercase tracking-widest text-xs">{event.venue}</span>
              </div>
              <div className="text-center md:text-right flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-xl font-black">{event.date}</span>
                  <span className={cn("text-[10px] uppercase font-black px-2 py-1 rounded-md text-center",
                    event.status === "Sold Out" ? "bg-red-500/20 text-red-500" : "bg-accent-green/20 text-accent-green"
                  )}>{event.status}</span>
                </div>
                <button className="px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-accent-orange hover:text-white transition-all disabled:opacity-50" disabled={event.status === "Sold Out"}>
                  {event.status === "Sold Out" ? "Sold Out" : "Get Tickets"}
                </button>
              </div>
            </motion.div>
          ))}
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
            { platform: "TikTok", handle: "@stevemonite", href: '', followers: "1.2M", color: "bg-[#fe2c55]" },
            { platform: "Instagram", handle: "https://www.instagram.com/stevemoniteofficial/", href: '', followers: "850K", color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
            { platform: "YouTube", handle: "Steve Monite TV", href: '', followers: "2K+", color: "bg-[#ff0000]" },
            { platform: "X", handle: "@stevemonite", href: '', followers: "200K", color: "bg-white text-black" },
          ].map((social) => (
            <Link key={social.platform} href={social.href} target="_blank" className="block outline-none">
              <motion.div
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl glass border border-white/5 flex flex-col items-center text-center group cursor-pointer h-full"
              >
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", social.color)}>
                  <Music className="w-8 h-8" />
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
    </main>
  );
}