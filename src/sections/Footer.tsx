"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaYoutube, FaDiscord, FaTwitch } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gradient-to-br mt-16 from-[#1F1A4B] to-[#2D2658] text-white w-full">
            <div className="w-full px-4 md:px-12 lg:px-20 py-6">
                {/* Logo and description */}
                <div className="flex flex-col items-center mb-4">
                    <Image
                        src="/logo.svg"
                        alt="Logo de BingoLive"
                        width={120}
                        height={35}
                        className="mb-2"
                    />
                    <p className="text-center text-gray-300 max-w-md text-sm">
                        The ultimate platform for social media bingo streaming.
                    </p>
                </div>

                {/* Grid for columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-700">
                    {/* Product column */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-bold text-base mb-2">Product</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/integration" className="text-gray-300 hover:text-white transition-colors">
                                    Integration
                                </Link>
                            </li>
                            <li>
                                <Link href="/api" className="text-gray-300 hover:text-white transition-colors">
                                    API
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources column */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-bold text-base mb-2">Resources</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-gray-300 hover:text-white transition-colors">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect column */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-bold text-base mb-2">Connect</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="YouTube"
                            >
                                <FaYoutube size={24} />
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Discord"
                            >
                                <FaDiscord size={24} />
                            </a>
                            <a
                                href="https://twitch.tv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors"
                                aria-label="Twitch"
                            >
                                <FaTwitch size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright and legal links */}
                <div className="pt-4 text-center text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} BingoLive. All rights reserved.</p>
                    <div className="flex justify-center mt-2 space-x-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
