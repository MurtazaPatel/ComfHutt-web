"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Linkedin, Twitter, MessageCircle } from "lucide-react";

const Share = () => {
  const [copied, setCopied] = useState(false);

const shareMessage = `ComfHutt makes real estate easy for everyone. You can own a small, affordable part of a real property, checked by smart AI for safety and trust. It’s a simple, smart way to start building wealth. Check it out: https://comfhutt.vercel.app`; 
 const shareUrl = "https://comfhutt.vercel.app";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPlatforms = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={20} />,
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`,
    },
    {
      name: "X/Twitter",
      icon: <Twitter size={20} />,
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=ComfHutt&summary=${encodeURIComponent(shareMessage)}`,
    },
  ];

  return (
    <motion.section
      className="py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-3xl text-center glass-card p-8 md:p-12 rounded-2xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Share the Future of Real Estate
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {shareMessage}
        </motion.p>
        <div className="flex justify-center items-center gap-4">
          {socialPlatforms.map((platform) => (
            <motion.a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-full transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {platform.icon}
            </motion.a>
          ))}
          <motion.button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </motion.button>
        </div>
        <motion.p
          className="text-sm text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Share this with someone who needs a smarter start.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Share;