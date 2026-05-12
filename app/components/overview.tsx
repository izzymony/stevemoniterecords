"use client";

import React from 'react';
import { LayoutDashboard, Disc, Calendar, Video, Users, Award, Globe, ChevronRight, Music } from 'lucide-react';
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

const Overview = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Releases', val: '24', color: 'text-accent-orange', icon: Disc },
          { label: 'Upcoming Shows', val: '5', color: 'text-accent-purple', icon: Calendar },
          { label: 'Music Videos', val: '12', color: 'text-accent-green', icon: Video },
          { label: 'Fan Reach', val: '1.2M', color: 'text-accent-gold', icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-3xl glass-dark border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
            <stat.icon className={cn("w-5 h-5 mb-4", stat.color)} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">{stat.label}</span>
            <span className={cn("text-4xl font-black", stat.color)}>{stat.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {[
              { type: 'release', title: 'New Release: Neon Nights', time: '2 hours ago', icon: Disc, color: 'text-accent-orange' },
              { type: 'event', title: 'Tour Date Added: London', time: '5 hours ago', icon: Calendar, color: 'text-accent-purple' },
              { type: 'video', title: 'Video Uploaded: Only You', time: '1 day ago', icon: Video, color: 'text-accent-green' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all", activity.color)}>
                       <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <span className="block font-bold text-xs uppercase tracking-widest">{activity.title}</span>
                       <span className="text-[10px] text-white/40">{activity.time}</span>
                    </div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all" />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-accent-orange hover:text-white transition-all text-left group">
               <Music className="w-6 h-6 text-accent-orange group-hover:text-white mb-4" />
               <span className="block font-black uppercase tracking-widest text-[10px]">Add Release</span>
            </button>
            <button className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-accent-purple hover:text-white transition-all text-left group">
               <Video className="w-6 h-6 text-accent-purple group-hover:text-white mb-4" />
               <span className="block font-black uppercase tracking-widest text-[10px]">Upload Video</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;