import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="KampusX - Kampüsüne Özel İkinci El ve Yardımlaşma Platformu">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* HEADER */}
            <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">K</span>
                            </div>
                            <span className="font-bold text-2xl text-gray-900 dark:text-white">KampusX</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-lg border border-blue-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-lg border border-transparent px-5 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 dark:text-gray-200 dark:hover:border-gray-600"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg border border-blue-600 bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:border-blue-700 hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:border-blue-400 dark:hover:bg-blue-400"
                                    >
                                        Üye Ol
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Kampüsüne Özel
                        <span className="block text-blue-600 dark:text-blue-400">İkinci El ve Yardımlaşma Platformu</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Sadece öğrenci e-posta adresinizle güvenli bir şekilde giriş yapın. 
                        Kitap, elektronik, giyim ve daha fazlasını kampüs içinde alıp satın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={route('register')}
                            className="inline-block rounded-lg border border-blue-600 bg-blue-600 px-8 py-4 text-lg font-medium text-white hover:border-blue-700 hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:border-blue-400 dark:hover:bg-blue-400"
                        >
                            Hemen Başla
                        </Link>
                        <Link
                            href={route('login')}
                            className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                        >
                            Öğrenci Mailiyle Giriş Yap
                        </Link>
                    </div>
                </div>
            </section>

            {/* NASIL ÇALIŞIR? */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Nasıl Çalışır?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">①</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Üye Ol</h3>
                            <p className="text-gray-600 dark:text-gray-300">Öğrenci e-posta adresinizle hızlıca üye olun</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900">
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">②</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">İlan Ver veya Göz At</h3>
                            <p className="text-gray-600 dark:text-gray-300">Ürünlerinizi satın veya ihtiyacınız olanı bulun</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-purple-900">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">③</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kampüs İçinde Buluş</h3>
                            <p className="text-gray-600 dark:text-gray-300">Güvenli bir şekilde kampüs içinde buluşup alışveriş yapın</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ÖNE ÇIKAN İLANLAR */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Öne Çıkan İlanlar
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
                            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 dark:bg-gray-600"></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Matematik Kitabı</h3>
                            <p className="text-green-600 font-bold text-lg">30 TL</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">İstanbul Üniversitesi</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
                            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 dark:bg-gray-600"></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Laptop</h3>
                            <p className="text-blue-600 font-bold text-lg">Takaslık</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Boğaziçi Üniversitesi</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
                            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 dark:bg-gray-600"></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bisiklet</h3>
                            <p className="text-green-600 font-bold text-lg">500 TL</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ODTÜ</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
                            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 dark:bg-gray-600"></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Kulaklık</h3>
                            <p className="text-green-600 font-bold text-lg">150 TL</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">İTÜ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEDEN BU PLATFORM? */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Neden Bu Platform?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">♻️</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sürdürülebilirlik</h3>
                            <p className="text-gray-600 dark:text-gray-300">İkinci el ürünlerle çevreye katkı sağlayın</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">💸</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Öğrenci Dostu Ekonomi</h3>
                            <p className="text-gray-600 dark:text-gray-300">Bütçenize uygun fiyatlarla alışveriş yapın</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🧑‍🎓</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kampüs Topluluğu</h3>
                            <p className="text-gray-600 dark:text-gray-300">Güvenilir öğrenci topluluğu içinde yer alın</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">K</span>
                            </div>
                            <span className="font-bold text-xl">KampusX</span>
                        </div>
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <Link href="#" className="text-gray-300 hover:text-white">
                                Hakkımızda
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white">
                                İletişim
                            </Link>
                            <Link href="#" className="text-gray-300 hover:text-white">
                                Gizlilik
                            </Link>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2025 KampusX. Tüm hakları saklıdır.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
