"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Copy } from 'lucide-react';
import { Button } from './button';

interface ProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ isOpen, onClose, triggerRef }) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [banner, setBanner] = useState('/default-banner.png');
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    const savedBanner = localStorage.getItem('banner');
    if (savedBanner) setBanner(savedBanner);

    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) setAvatar(savedAvatar);

    const savedDisplayName = localStorage.getItem('displayName');
    if (savedDisplayName) setDisplayName(savedDisplayName);

    const savedPronouns = localStorage.getItem('pronouns');
    if (savedPronouns) setPronouns(savedPronouns);

    const savedAboutMe = localStorage.getItem('aboutMe');
    if (savedAboutMe) setAboutMe(savedAboutMe);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'banner' && event.newValue) setBanner(event.newValue);
      if (event.key === 'avatar' && event.newValue) setAvatar(event.newValue);
      if (event.key === 'displayName' && event.newValue) setDisplayName(event.newValue);
      if (event.key === 'pronouns' && event.newValue) setPronouns(event.newValue);
      if (event.key === 'aboutMe' && event.newValue) setAboutMe(event.newValue);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current && cardRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const cardHeight = 410; // Adjusted height for reduced content
      const scrollY = window.scrollY;

      setPosition({
        top: triggerRect.top + scrollY - cardHeight - 10,
        left: triggerRect.left - 60, // Left-aligned relative to trigger
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current && 
        !cardRef.current.contains(event.target as Node) && 
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={cardRef}
          className="fixed z-50 w-80 rounded-xl overflow-hidden shadow-2xl bg-white text-black border border-gray-300"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Banner */}
          <div className="h-32 relative bg-white">
            <img 
              src={banner} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 rounded-full bg-gray-200/50 backdrop-blur-sm p-1 hover:bg-gray-300/70 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          {/* Profile Photo */}
          <div className="relative h-8 mb-12">
            <div className="absolute -top-10 left-6 w-20 h-20 rounded-full border-4 border-gray-200 overflow-hidden">
              <img 
                src={avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* User Info */}
          <div className="px-6 pb-4">
            <h2 className="text-xl font-bold text-black">{displayName || 'Your Name'}</h2>
            <p className="text-sm text-gray-600 mb-2">{pronouns ? `${pronouns}` : '@user • User'}</p>
            <p className="text-sm text-gray-700 mb-4">{aboutMe || 'No bio yet'}</p>
            
            {/* Action buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/setting/user/profiles")}
                variant="ghost" 
                className="w-full flex items-center justify-start bg-gray-100 text-black hover:bg-red-100 px-4 py-2 rounded-md"
              >
                <Pencil size={18} className="mr-2" />
                <span>Edit Profile</span>
              </Button>
              <Button
                variant="ghost" 
                className="w-full flex items-center justify-start bg-gray-100 text-black hover:bg-red-100 px-4 py-2 rounded-md"
              >
                <Copy size={18} className="mr-2" />
                <span>Copy User ID</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileCard;