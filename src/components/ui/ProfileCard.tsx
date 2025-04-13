'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Copy } from 'lucide-react';
import { Button } from './button';

interface Profile {
  bannerUrl?: string;
  avatarUrl?: string;
  username: string;
  displayName?: string;
  pronoun?: string;
  description?: string;
}

interface ProfileCardProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isOpen, onClose, triggerRef }) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const {
    bannerUrl = '/default-banner.png',
    avatarUrl = '/default-avatar.png',
    displayName = 'Your Name',
    pronoun = '@user • User',
    description = 'No bio yet',
    username = '@'
  } = profile || {};

  useEffect(() => {
    if (isOpen && triggerRef.current && cardRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const cardHeight = 410;
      const scrollY = window.scrollY;

      setPosition({
        top: triggerRect.top + scrollY - cardHeight - 10,
        left: triggerRect.left - 60,
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 rounded-full bg-gray-200/50 backdrop-blur-sm p-1 hover:bg-gray-300/70 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Avatar */}
          <div className="relative h-8 mb-4">
            <div className="absolute -top-10 left-6 w-20 h-20 rounded-full border-4 border-indigo-50 overflow-hidden">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pb-4">
            <h2 className="text-xl font-bold text-indigo-600">{displayName}</h2>
            <p className="text-sm text-indigo-500 mb-2">@{username} &#x25CF; {pronoun}</p>
            <p className="text-sm text-indigo-700 mb-4">{description}</p>

            <div className="space-y-2">
              <Button
                onClick={() => router.push('/setting/user/profiles')}
                variant="ghost"
                className="w-full flex items-center justify-start bg-indigo-50 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-md"
              >
                <Pencil size={18} className="mr-2" />
                <span>Edit Profile</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start bg-indigo-50 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-md"
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
