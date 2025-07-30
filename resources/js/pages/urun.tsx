import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Heart, Truck, Shield, MapPin, Calendar, User, Mail, MoreVertical, Star, Users, GraduationCap, Eye, Plus, Edit, Trash2, Phone, Globe, Lock, Users as UsersIcon, ArrowLeft, Share2, MessageCircle, Tag, CheckCircle, Image as ImageIcon, HelpCircle, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Urun() {
    const { auth } = usePage<SharedData>().props;
    const { product, seller, viewer, questions } = usePage<{ product: any; seller: any; viewer: any; questions: any }>().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [answeringQuestion, setAnsweringQuestion] = useState<number | null>(null);

    const questionForm = useForm({
        question: '',
    });

    const answerForm = useForm({
        answer: '',
    });
    
    // Gizlilik ikonunu render eder
    const getPrivacyIcon = (privacy: string) => {
        switch (privacy) {
            case 'public':
                return <Globe className="w-4 h-4 text-green-600" />;
            case 'members':
                return <UsersIcon className="w-4 h-4 text-blue-600" />;
            case 'private':
                return <Lock className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getConditionText = (condition: string) => {
        switch (condition) {
            case 'new':
                return 'Yeni';
            case 'like_new':
                return 'Az Kullanılmış';
            case 'used':
                return 'Kullanılmış';
            default:
                return condition;
        }
    };

    const getCategoryText = (category: string) => {
        const categories: { [key: string]: string } = {
            'electronics': 'Elektronik',
            'books': 'Kitap',
            'clothing': 'Giyim',
            'sports': 'Spor',
            'home': 'Ev & Yaşam',
            'automotive': 'Otomotiv',
            'other': 'Diğer'
        };
        return categories[category] || category;
    };

    const formatPrice = (price: number) => {
        return Number(price) % 1 === 0 
            ? Number(price).toFixed(0) + ' ₺'
            : Number(price).toFixed(2) + ' ₺';
    };

    return (
        <>
            <Head title={`${product.title} - KampusX`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* HEADER */}
            <header className="bg-background shadow-sm border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="font-bold text-2xl text-foreground hover:text-muted-foreground">
                                KampusX
                            </Link>
                        </div>

                        <div className="flex-1"></div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-[#075B5E] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#064A4D] transition-colors duration-200 shadow-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="border border-sidebar-border text-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent hover:border-sidebar-border/80 transition-colors duration-200"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-[#FF3F33] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#E6392E] transition-colors duration-200 shadow-sm"
                                    >
                                        Üye Ol
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* CATEGORIES NAVIGATION */}
            <nav className="bg-background border-b border-sidebar-border/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center overflow-x-auto py-3 scrollbar-hide">
                        <div className="flex items-center space-x-6 min-w-max">
                            <button className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                TÜM KATEGORİLER
                            </button>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Kitap
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Elektronik
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Giyim
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Spor
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Ev & Yaşam
                            </Link>
                            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Takas
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column - Product Images */}
                        <div className="xl:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={`/storage/${product.images[selectedImage]}`}
                                            alt={product.title}
                                            className="w-full h-[500px] object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                <span className="text-gray-500 dark:text-gray-400">Fotoğraf Yok</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Floating Action Buttons */}
                                    <div className="absolute top-6 right-6 flex gap-3">
                                        <button className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Image Counter */}
                                    {product.images && product.images.length > 1 && (
                                        <div className="absolute bottom-6 left-6 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            {selectedImage + 1} / {product.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.images && product.images.length > 1 && (
                                    <div className="p-6 bg-gray-50 dark:bg-gray-900">
                                        <div className="flex gap-3 overflow-x-auto">
                                            {product.images.map((image: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                        selectedImage === index 
                                                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                    }`}
                                                >
                                                    <img 
                                                        src={`/storage/${image}`}
                                                        alt={`${product.title} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Minimalist Soru-Cevap Kısmı */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-blue-600" />
                                        Sorular ({questions?.total || 0})
                                    </h3>
                                    {auth.user ? (
                                        auth.user.id !== product.user_id && (
                                            <button
                                                onClick={() => setShowQuestionForm(!showQuestionForm)}
                                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                            >
                                                {showQuestionForm ? 'İptal' : 'Soru Sor'}
                                            </button>
                                        )
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            Soru sormak için giriş yapın
                                        </Link>
                                    )}
                                </div>

                                {/* Soru Formu */}
                                {showQuestionForm && auth.user && auth.user.id !== product.user_id && (
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            questionForm.post(route('questions.store', { product: product.id }), {
                                                onSuccess: () => {
                                                    questionForm.reset();
                                                    setShowQuestionForm(false);
                                                },
                                            });
                                        }}>
                                            <textarea
                                                value={questionForm.data.question}
                                                onChange={(e) => questionForm.setData('question', e.target.value)}
                                                placeholder="Ürün hakkında sorunuzu yazın..."
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white resize-none text-sm"
                                                rows={2}
                                                required
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    type="submit"
                                                    disabled={questionForm.processing}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                >
                                                    {questionForm.processing ? 'Gönderiliyor...' : 'Gönder'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Sorular Listesi */}
                                <div className="space-y-3">
                                    {questions && questions.data && questions.data.length > 0 ? (
                                        questions.data.map((question) => (
                                            <div key={question.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-1">
                                                        <Link
                                                            href={route('public.profile', { unique_id: question.asked_by.unique_id })}
                                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                        >
                                                            {question.asked_by.name} {question.asked_by.surname}
                                                        </Link>
                                                        <span className="text-xs text-gray-500">@{question.asked_by.unique_id}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(question.created_at).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{question.question}</p>
                                                
                                                {question.is_answered ? (
                                                    <div className="ml-3 pl-3 border-l-2 border-blue-200 dark:border-blue-800">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <Link
                                                                href={route('public.profile', { unique_id: seller.unique_id })}
                                                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                            >
                                                                {seller.name} {seller.surname} (Satıcı)
                                                            </Link>
                                                            <span className="text-xs text-gray-500">@{seller.unique_id}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">{question.answer}</p>
                                                    </div>
                                                ) : (
                                                    <div className="ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                                                        <p className="text-xs text-gray-500 italic">Henüz cevaplanmadı</p>
                                                        {auth.user && auth.user.id === product.user_id && (
                                                            <button
                                                                onClick={() => setAnsweringQuestion(question.id)}
                                                                className="mt-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                Cevap Ver
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Cevap Formu */}
                                                {answeringQuestion === question.id && auth.user && auth.user.id === product.user_id && (
                                                    <div className="ml-3 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                                        <form onSubmit={(e) => {
                                                            e.preventDefault();
                                                            answerForm.post(route('questions.answer', { question: question.id }), {
                                                                onSuccess: () => {
                                                                    answerForm.reset();
                                                                    setAnsweringQuestion(null);
                                                                },
                                                            });
                                                        }}>
                                                            <textarea
                                                                value={answerForm.data.answer}
                                                                onChange={(e) => answerForm.setData('answer', e.target.value)}
                                                                placeholder="Cevabınızı yazın..."
                                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-800 dark:text-white resize-none"
                                                                rows={2}
                                                                required
                                                            />
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAnsweringQuestion(null)}
                                                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                                                >
                                                                    İptal
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    disabled={answerForm.processing}
                                                                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                                >
                                                                    {answerForm.processing ? 'Gönderiliyor...' : 'Cevap Ver'}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Henüz soru sorulmamış</p>
                                            {auth.user ? (
                                                auth.user.id !== product.user_id && (
                                                    <p className="text-xs text-gray-400 mt-1">İlk soruyu siz sorun!</p>
                                                )
                                            ) : (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    <Link href={route('login')} className="text-blue-600 hover:text-blue-700">
                                                        Giriş yaparak
                                                    </Link> ilk soruyu siz sorun!
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {questions && questions.data && questions.last_page > 1 && (
                                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            {/* Önceki Sayfa */}
                                            {questions.current_page > 1 && (
                                                <Link
                                                    href={`/urun/${product.id}?page=${questions.current_page - 1}`}
                                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Link>
                                            )}

                                            {/* Sayfa Numaraları */}
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: questions.last_page }, (_, i) => i + 1).map((page) => (
                                                    <Link
                                                        key={page}
                                                        href={`/urun/${product.id}?page=${page}`}
                                                        className={`px-3 py-1 text-sm rounded ${
                                                            page === questions.current_page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Sonraki Sayfa */}
                                            {questions.current_page < questions.last_page && (
                                                <Link
                                                    href={`/urun/${product.id}?page=${questions.current_page + 1}`}
                                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Info & Seller */}
                        <div className="space-y-6">
                            {/* Product Info Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                                <div className="space-y-6">
                                    {/* Title & Price */}
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                            {product.title}
                                        </h1>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">TL</span>
                                        </div>
                                    </div>

                                    {/* Quick Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Kategori</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{getCategoryText(product.category)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Durum</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{getConditionText(product.condition)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {product.location && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Konum</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{product.location}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">İlan Tarihi</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {new Date(product.created_at).toLocaleDateString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Açıklama</h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                                            <MessageCircle className="w-5 h-5" />
                                            Satıcı ile İletişim
                                        </button>
                                        <button className="w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-3">
                                            <Heart className="w-5 h-5" />
                                            Favorilere Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Info Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-xl">
                                                {seller.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {seller.name} {seller.surname}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{seller.unique_id}</p>
                                        {seller.university_name && (
                                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                {seller.university_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {seller.email && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{seller.email}</span>
                                        </div>
                                    )}
                                    {seller.phone && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{seller.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={route('public.profile', { unique_id: seller.unique_id })}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <User className="w-4 h-4" />
                                    Profili Görüntüle
                                </Link>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}