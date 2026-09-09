
import Link from 'next/link';
import { Home, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NyumbaSalama</span>
            </Link>
            <p className="text-sm text-gray-400">
              A safe and reliable platform for finding housing for university students in Dar es Salaam. Covering UDSM, ARU, MUHAS, DIT, and all other institutions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Universities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?university=UDSM" className="hover:text-orange-400 transition-colors">UDSM - Mlimani</Link></li>
              <li><Link href="/?university=ARU" className="hover:text-orange-400 transition-colors">ARU - Ardhi</Link></li>
              <li><Link href="/?university=MUHAS" className="hover:text-orange-400 transition-colors">MUHAS - Upanga</Link></li>
              <li><Link href="/?university=DIT" className="hover:text-orange-400 transition-colors">DIT - City Center</Link></li>
              <li><Link href="/?university=IFM" className="hover:text-orange-400 transition-colors">IFM - City Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Price & Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?range=50K-150K" className="hover:text-orange-400 transition-colors">Price 50K - 150K</Link></li>
              <li><Link href="/?range=150K-300K" className="hover:text-orange-400 transition-colors">Price 150K - 300K</Link></li>
              <li><Link href="/?range=300K+" className="hover:text-orange-400 transition-colors">Price 300K+</Link></li>
              <li><Link href="/videos" className="hover:text-orange-400 transition-colors">Housing Videos</Link></li>
              <li><Link href="/upload" className="hover:text-orange-400 transition-colors">Upload Video</Link></li>
            </ul>
          </div>

          {/* Contact Us - WITH WHATSAPP LINK */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                Dar es Salaam, Tanzania
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <a 
                  href="https://wa.me/255792077777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  💬 WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <a 
                  href="mailto:sankhathecoder@gmail.com" 
                  className="hover:text-orange-400 transition-colors"
                >
                  sankhathecoder@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NyumbaSalama. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in Dar es Salaam
          </p>
        </div>
      </div>
    </footer>
  );
}
