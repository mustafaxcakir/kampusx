import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Heart, Truck, Shield, MapPin, Calendar, User, Mail, MoreVertical, Star, Users, GraduationCap, Eye, Plus, Edit, Trash2, Phone, Globe, Lock, Users as UsersIcon, ArrowLeft, Share2, MessageCircle, Tag, CheckCircle, Image as ImageIcon, HelpCircle, Send, X, ChevronLeft, ChevronRight, Flag, ZoomIn } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/footer';

export default function Urun() {
    const { auth } = usePage<SharedData>().props;
    const { product, seller, viewer, questions, isFavorited } = usePage<{ product: any; seller: any; viewer: any; questions: any; isFavorited: boolean }>().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [answeringQuestion, setAnsweringQuestion] = useState<number | null>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [showZoomModal, setShowZoomModal] = useState(false);

    // Klavye tuşlarıyla fotoğraf geçişi
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!product.images || product.images.length <= 1) return;
        
        if (e.key === 'ArrowLeft') {
            const newIndex = selectedImage === 0 ? product.images.length - 1 : selectedImage - 1;
            setSelectedImage(newIndex);
            setImageLoading(true);
        } else if (e.key === 'ArrowRight') {
            const newIndex = selectedImage === product.images.length - 1 ? 0 : selectedImage + 1;
            setSelectedImage(newIndex);
            setImageLoading(true);
        }
    };

    // Component mount olduğunda event listener ekle
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage, product.images]);

    // Modal için ESC tuşu desteği
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showZoomModal) {
                setShowZoomModal(false);
            }
        };

        if (showZoomModal) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden'; // Scroll'u engelle
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset'; // Scroll'u geri aç
        };
    }, [showZoomModal]);

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
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
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
                        <Link href={route('home')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                            <span className="font-bold text-2xl text-foreground">KampusX</span>
                        </Link>

                        <div className="flex-1"></div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-3 md:space-x-4">
                                    <div className="hidden md:block">
                                        <span className="text-sm text-muted-foreground">Hoşgeldin,</span>
                                        <span className="text-sm font-medium text-foreground ml-1">
                                            {auth.user.name} {auth.user.surname}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-[#101828] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('ilanver')}
                                        className="bg-blue-600 text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                    >
                                        İlan Ver
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="bg-[#101828] text-white px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-[#0D141F] transition-colors duration-200 shadow-sm"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <div className="relative inline-flex items-center justify-center gap-2 md:gap-4 group">
                                        <div
                                            className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg blur-lg filter group-hover:opacity-100 group-hover:duration-200"
                                        ></div>
                                        <Link
                                            href={route('register')}
                                            className="group relative inline-flex items-center justify-center text-xs md:text-sm rounded-lg bg-blue-600 px-3 md:px-6 py-2 md:py-2.5 font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-600/30"
                                        >
                                            Üye Ol
                                        </Link>
                                    </div>
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
                            <Link href={route('home')} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                TÜM KATEGORİLER
                            </Link>
                            <Link href={route('category.show', { category: 'books' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Kitap
                            </Link>
                            <Link href={route('category.show', { category: 'electronics' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Elektronik
                            </Link>
                            <Link href={route('category.show', { category: 'clothing' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Giyim
                            </Link>
                            <Link href={route('category.show', { category: 'sports' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Spor
                            </Link>
                            <Link href={route('category.show', { category: 'home' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Ev & Yaşam
                            </Link>
                            <Link href={route('category.show', { category: 'other' })} className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap">
                                Diğer
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="min-h-screen bg-muted/50">
                <div className="max-w-6xl mx-auto p-4 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Product Images */}
                        <div className="lg:col-span-2">
                            <div className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden">
                                <div className="relative">
                                    {product.images && product.images.length > 0 ? (
                                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 dark:bg-gray-800">
                                            {imageLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                                                </div>
                                            )}
                                            <img 
                                                src={`/storage/${product.images[selectedImage]}`}
                                                alt={product.title}
                                                className="w-full h-full object-contain"
                                                onLoad={() => setImageLoading(false)}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                    setImageLoading(false);
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <span className="text-gray-500 dark:text-gray-400">Fotoğraf Yüklenemedi</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                <span className="text-gray-500 dark:text-gray-400">Fotoğraf Yok</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Floating Action Buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => setShowZoomModal(true)}
                                            className="p-2 bg-card/90 backdrop-blur-sm text-muted-foreground rounded-lg hover:bg-card transition-all duration-200 shadow-sm border border-sidebar-border/70 cursor-pointer hover:text-foreground"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-card/90 backdrop-blur-sm text-muted-foreground rounded-lg hover:bg-card transition-all duration-200 shadow-sm border border-sidebar-border/70 cursor-pointer hover:text-foreground">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Navigation Arrows */}
                                    {product.images && product.images.length > 1 && (
                                        <>
                                            {/* Sol Ok */}
                                            <button 
                                                onClick={() => {
                                                    const newIndex = selectedImage === 0 ? product.images.length - 1 : selectedImage - 1;
                                                    setSelectedImage(newIndex);
                                                    setImageLoading(true);
                                                }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card/90 backdrop-blur-sm text-muted-foreground rounded-full hover:bg-card transition-all duration-200 shadow-sm border border-sidebar-border/70 cursor-pointer hover:text-foreground hidden md:block"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            {/* Sağ Ok */}
                                            <button 
                                                onClick={() => {
                                                    const newIndex = selectedImage === product.images.length - 1 ? 0 : selectedImage + 1;
                                                    setSelectedImage(newIndex);
                                                    setImageLoading(true);
                                                }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card/90 backdrop-blur-sm text-muted-foreground rounded-full hover:bg-card transition-all duration-200 shadow-sm border border-sidebar-border/70 cursor-pointer hover:text-foreground hidden md:block"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {product.images && product.images.length > 1 && (
                                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                                            {selectedImage + 1} / {product.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {product.images && product.images.length > 1 && (
                                    <div className="p-4 bg-muted/30">
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {product.images.map((image: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedImage(index);
                                                        setImageLoading(true);
                                                    }}
                                                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-gray-100 dark:bg-gray-800 ${
                                                        selectedImage === index 
                                                            ? 'border-foreground ring-2 ring-foreground/20' 
                                                            : 'border-sidebar-border/70 hover:border-sidebar-border'
                                                    }`}
                                                >
                                                    <img 
                                                        src={`/storage/${image}`}
                                                        alt={`${product.title} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
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
                            <div className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 p-6">
                                <div className="space-y-6">
                                    {/* Price & Title */}
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-3xl font-bold text-card-foreground">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl font-bold text-card-foreground leading-tight">
                                                {product.title}
                                            </h1>
                                            {!product.is_active && (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-sm font-medium rounded-full">
                                                    Satıldı
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* İlan Özellikleri */}
                                    <div>
                                        <h3 className="text-base font-medium text-card-foreground mb-3">İlan Özellikleri</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2 border-b border-sidebar-border/30">
                                                <span className="text-sm text-muted-foreground">Kategori</span>
                                                <span className="text-sm font-medium text-card-foreground">{getCategoryText(product.category)}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-sidebar-border/30">
                                                <span className="text-sm text-muted-foreground">Durum</span>
                                                <span className="text-sm font-medium text-card-foreground">{getConditionText(product.condition)}</span>
                                            </div>
                                            {product.university?.name && (
                                                <div className="flex items-center justify-between py-2 border-b border-sidebar-border/30">
                                                    <span className="text-sm text-muted-foreground">Üniversite</span>
                                                    <span className="text-sm font-medium text-card-foreground">{product.university.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-sm text-muted-foreground">İlan Tarihi</span>
                                                <span className="text-sm font-medium text-card-foreground">
                                                    {new Date(product.created_at).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-base font-medium text-card-foreground mb-2">Açıklama</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        {/* Satıcı ise Satıldı butonu göster (sadece aktif ürünler için) */}
                                        {auth.user && auth.user.id === product.user_id && product.is_active && (
                                            <button 
                                                onClick={() => router.patch(route('product.mark-as-sold', { id: product.id }))}
                                                className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Satıldı Olarak İşaretle
                                            </button>
                                        )}
                                        
                                        {/* Alıcı ise iletişim butonu göster */}
                                        {auth.user && auth.user.id !== product.user_id && (
                                            <button className="w-full bg-[#101828] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0D141F] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
                                                <MessageCircle className="w-4 h-4" />
                                                Satıcı ile İletişim
                                            </button>
                                        )}
                                        
                                        {auth.user && auth.user.id !== product.user_id ? (
                                            isFavorited ? (
                                                <button 
                                                    onClick={() => router.delete(route('favorites.remove', { product: product.id }))}
                                                    className="w-full bg-[#FF3F33] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#E6392E] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <Heart className="w-4 h-4 fill-white text-white" />
                                                    Favorilerden Çıkar
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => router.post(route('favorites.add', { product: product.id }))}
                                                    className="w-full bg-[#101828] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0D141F] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    Favorilere Ekle
                                                </button>
                                            )
                                        ) : (
                                            <button className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2" disabled>
                                                <Heart className="w-4 h-4" />
                                                {auth.user ? 'Kendi İlanınız' : 'Giriş Yapın'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Seller Info Card */}
                            <div className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#101828] rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {seller.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-card-foreground">
                                            {seller.name} {seller.surname}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">@{seller.unique_id}</p>
                                        {seller.university_name && (
                                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                {seller.university_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {seller.email && (
                                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-card-foreground">{seller.email}</span>
                                        </div>
                                    )}
                                    {seller.phone && (
                                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-card-foreground">{seller.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={route('public.profile', { unique_id: seller.unique_id })}
                                    className="w-full bg-[#101828] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#0D141F] transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    Profili Görüntüle
                                </Link>
                            </div>

                            {/* Şikayet Butonu */}
                            <div className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 p-4">
                                <button 
                                    className="w-full bg-gray-100 text-gray-500 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                                    disabled
                                >
                                    <Flag className="w-4 h-4" />
                                    İlanı Bildir
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Zoom Modal */}
            {showZoomModal && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowZoomModal(false)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Arrows */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button 
                                    onClick={() => {
                                        const newIndex = selectedImage === 0 ? product.images.length - 1 : selectedImage - 1;
                                        setSelectedImage(newIndex);
                                        setImageLoading(true);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>

                                <button 
                                    onClick={() => {
                                        const newIndex = selectedImage === product.images.length - 1 ? 0 : selectedImage + 1;
                                        setSelectedImage(newIndex);
                                        setImageLoading(true);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        {product.images && product.images.length > 0 ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                )}
                                <img 
                                    src={`/storage/${product.images[selectedImage]}`}
                                    alt={product.title}
                                    className="max-w-full max-h-full object-contain"
                                    onLoad={() => setImageLoading(false)}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        setImageLoading(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-white">
                                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <span className="opacity-50">Fotoğraf Yok</span>
                            </div>
                        )}

                        {/* Image Counter */}
                        {product.images && product.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                                {selectedImage + 1} / {product.images.length}
                            </div>
                        )}

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                                <div className="flex gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-2">
                                    {product.images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedImage(index);
                                                setImageLoading(true);
                                            }}
                                            className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === index 
                                                    ? 'border-white' 
                                                    : 'border-white/30 hover:border-white/60'
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
                </div>
            )}
            
            <Footer />
        </>
    );
}