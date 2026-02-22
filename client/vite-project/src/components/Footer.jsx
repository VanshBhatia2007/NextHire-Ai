import React from 'react';



function Footer() {
    return (
        <>
            {/* FOOTER */}
            <footer className="border-t border-neutral-900 pt-16 pb-12 bg-neutral-950 relative z-10">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

                    <div className="col-span-2 space-y-4">
                        <a href="/" className="font-extrabold text-xl text-white tracking-wide">NextHire AI</a>
                        <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                            AI-driven career development, interview preparation, and applicant analysis modules built to empower talent worldwide.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Features</h5>
                        <ul className="space-y-2 text-xs text-neutral-500">
                            <li><a href="#" className="hover:text-white transition">Resume Matcher</a></li>
                            <li><a href="#" className="hover:text-white transition">Mock Coach</a></li>
                            <li><a href="#" className="hover:text-white transition">Auto Apply</a></li>
                            <li><a href="#" className="hover:text-white transition">Job Feed</a></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h5>
                        <ul className="space-y-2 text-xs text-neutral-500">
                            <li><a href="#" className="hover:text-white transition">Career Guides</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition">Support</a></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Company</h5>
                        <ul className="space-y-2 text-xs text-neutral-500">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Security</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-6xl mx-auto px-6 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
                    <p>© {new Date().getFullYear()} NextHire AI. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition">Twitter</a>
                        <a href="#" className="hover:text-white transition">LinkedIn</a>
                        <a href="#" className="hover:text-white transition">GitHub</a>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer