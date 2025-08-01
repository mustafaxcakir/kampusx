import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="font-bold text-xl">KampusX</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Kampüs içi ikinci el alışveriş platformu. Güvenli, hızlı ve kolay kullanım ile öğrenciler arası ticareti kolaylaştırıyoruz.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={route('home')} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href={route('category.show', { category: 'electronics' })} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Elektronik
                                </Link>
                            </li>
                            <li>
                                <Link href={route('category.show', { category: 'books' })} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Kitaplar
                                </Link>
                            </li>
                            <li>
                                <Link href={route('category.show', { category: 'clothing' })} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Giyim
                                </Link>
                            </li>
                            <li>
                                <Link href={route('category.show', { category: 'sports' })} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Spor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Destek</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Yardım Merkezi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Güvenlik Rehberi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Kullanım Şartları
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    Gizlilik Politikası
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    İletişim
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">İletişim</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">info@kampusx.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">+90 (212) 555 0123</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <span className="text-gray-300 text-sm">
                                    İstanbul, Türkiye<br />
                                    Kampüs Mahallesi, Üniversite Caddesi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2025 KampusX. Tüm hakları saklıdır.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Çerez Politikası
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                KVKK
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Sıkça Sorulan Sorular
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 