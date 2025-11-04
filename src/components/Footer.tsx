import { 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Heart,
  Trophy,
  Shield,
  Sparkles,
  Gamepad2
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'FAQ', href: '#faq' },
    ],
    community: [
      { name: 'Discord', href: '#discord' },
      { name: 'Forums', href: '#forums' },
      { name: 'Events', href: '#events' },
      { name: 'Tournaments', href: '#tournaments' },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: <Mail className="w-5 h-5" />, href: '#', label: 'Email', color: 'hover:text-red-400' },
  ];

  return (
    <footer className="relative z-10 bg-gradient-to-b from-slate-900/50 to-slate-950/90 backdrop-blur-md border-t border-white/10">
      {/* Top decorative line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Gamepad2 className="w-10 h-10 text-yellow-400" />
                <Sparkles className="w-5 h-5 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-2xl font-black">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Quiz</span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Arena</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-xs">
              The ultimate multiplayer trivia platform. Battle players worldwide, unlock achievements, and prove you're the smartest warrior in the arena!
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a   
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 ${social.color} transition-all duration-300 transform hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-green-400" />
              Community
            </h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-b border-white/10 py-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1">
                1M+
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wide">Players</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                50K+
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wide">Daily Games</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                100K+
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wide">Questions</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                180+
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wide">Countries</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <div className="text-white/50 text-sm text-center md:text-left">
            © {currentYear} QuizArena. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
            <span>by</span>
            <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Sucre
            </span>
          </div>

          <div className="flex gap-4 text-xs text-white/50">
            <a href="#status" className="hover:text-white transition-colors">Status</a>
            <span>•</span>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <span>•</span>
            <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </footer>
  );
};

export default Footer;