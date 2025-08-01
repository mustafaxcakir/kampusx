import { useEffect, useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2, Package, Calendar, MapPin, X } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'İlanlarım',
        href: '/ilanlarim',
    },
];

const categories = [
    { value: 'electronics', label: 'Elektronik' },
    { value: 'books', label: 'Kitap' },
    { value: 'clothing', label: 'Giyim' },
    { value: 'sports', label: 'Spor' },
    { value: 'home', label: 'Ev & Yaşam' },
    { value: 'automotive', label: 'Otomotiv' },
    { value: 'other', label: 'Diğer' },
];

const conditions = [
    { value: 'new', label: 'Yeni' },
    { value: 'like_new', label: 'Az Kullanılmış' },
    { value: 'used', label: 'Kullanılmış' },
];

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

    const getConditionText = (condition: string) => {
        const conditions: { [key: string]: string } = {
            'new': 'Yeni',
            'like_new': 'Az Kullanılmış',
            'used': 'Kullanılmış'
        };
        return conditions[condition] || condition;
    };

    const formatPrice = (price: number) => {
        const numPrice = Number(price);
        return numPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ₺';
    };

            export default function Ilanlarim() {
                const { csrf } = usePage<{ csrf: string }>().props;
                const [products, setProducts] = useState<any[]>([]);
                const [editModal, setEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState<any>(null);
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');


    const form = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        university_id: '',
    });
    
    const deleteForm = useForm({});

                    useEffect(() => {
                    fetch('/my-products')
                        .then(res => res.json())
                        .then(data => {
                            setProducts(data);
                            setLoading(false);
                        })
                        .catch(() => {
                            setLoading(false);
                        });
                }, []);

    // Optimize edilmiş Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const newVisibleImages = new Set(visibleImages);
                let hasChanges = false;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const productId = parseInt(entry.target.getAttribute('data-product-id') || '0');
                        if (!newVisibleImages.has(productId)) {
                            newVisibleImages.add(productId);
                            hasChanges = true;
                        }
                    }
                });

                if (hasChanges) {
                    setVisibleImages(newVisibleImages);
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '200px' // Daha fazla önceden yükle
            }
        );

        // Tüm ürün kartlarını gözlemle
        const cards = document.querySelectorAll('[data-product-id]');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [products, visibleImages]);

    const openEditModal = useCallback((product: any) => {
        setEditProduct(product);
        form.setData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            university_id: product.university_id?.toString() || '',
        });
        setEditModal(true);
    }, [form]);

    const closeEditModal = () => {
        setEditModal(false);
        setEditProduct(null);
        form.reset();
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        if (type === 'success') {
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } else {
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 3000);
        }
    };



    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Inertia.js ile gönder
        form.patch(`/products/${editProduct.id}`, {
            onSuccess: (page) => {
                // Backend'den dönen güncel ürün verisini kullan
                if (page.props.updatedProduct) {
                    setProducts(products.map(p => p.id === editProduct.id ? page.props.updatedProduct : p));
                } else {
                    // Eğer backend'den veri dönmüyorsa, local state'i güncelle
                    const updated = form.data;
                    setProducts(products.map(p => p.id === editProduct.id ? { 
                        ...p, 
                        ...updated
                    } : p));
                }
                
                closeEditModal();
                showToast('İlan başarıyla güncellendi!', 'success');
            },
            onError: (errors) => {
                showToast('Güncelleme hatası: ' + Object.values(errors).join(', '), 'error');
            }
        });
    };

    const openDeleteModal = useCallback((product: any) => {
        setDeleteProduct(product);
        setDeleteModal(true);
    }, []);

    const closeDeleteModal = () => {
        setDeleteModal(false);
        setDeleteProduct(null);
    };

    const handleDelete = () => {
        if (!deleteProduct) return;
        
        // Inertia.js ile silme
        deleteForm.post(`/products/${deleteProduct.id}/delete`, {
            onSuccess: () => {
                setProducts(products.filter(p => p.id !== deleteProduct.id));
                closeDeleteModal();
                showToast('İlan başarıyla silindi!', 'success');
            },
            onError: (errors) => {
                showToast('Silme hatası: ' + Object.values(errors).join(', '), 'error');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="İlanlarım" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-card-foreground">İlanlarım</h1>
                        {products.length > 0 && (
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Toplam: {products.length}</span>
                                <span>Aktif: {products.filter(p => p.is_active).length}</span>
                                <span>Satıldı: {products.filter(p => !p.is_active).length}</span>
                            </div>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground">İlanlarınız yükleniyor...</p>
                    </div>
                ) : products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-medium text-card-foreground mb-2">Henüz ilanınız yok</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        İlk ilanınızı oluşturarak ürünlerinizi satışa çıkarabilirsiniz.
                                    </p>
                                    <Link
                                        href="/ilanver"
                                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        İlan Ver
                                    </Link>
                                </div>
                            ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {products.map(product => (
                            <div key={product.id} className="bg-card rounded-xl shadow-sm border border-sidebar-border/70 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col" data-product-id={product.id} style={{ willChange: 'transform' }}>
                                <div className="p-4 flex-1 flex flex-col gap-2">
                                    <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            visibleImages.has(product.id) ? (
                                                <img
                                                    src={"/storage/" + product.images[0]}
                                                    alt={product.title}
                                                    className="object-cover w-full h-full"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <div className="w-4 h-4 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">Fotoğraf yok</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="font-bold text-primary text-sm sm:text-base">
                                            {formatPrice(product.price)}
                                        </div>
                                        {!product.is_active && (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs font-medium rounded-full self-start sm:self-auto">
                                                Satıldı
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>{Math.ceil((Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24))} gün önce</span>
                                    </div>
                                    {product.university?.name && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{product.university.name}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                        {product.is_active && (
                                            <Button size="sm" variant="outline" onClick={() => openEditModal(product)} className="w-full sm:w-auto">
                                                <Pencil className="w-4 h-4 mr-1" /> Düzenle
                                            </Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => openDeleteModal(product)} className="w-full sm:w-auto">
                                            <Trash2 className="w-4 h-4 mr-1" /> Sil
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Düzenle Modalı */}
            <Dialog open={editModal} onOpenChange={setEditModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>İlanı Düzenle</DialogTitle>
                        <DialogDescription>
                            İlanınızın bilgilerini güncelleyin. Değişiklikler kaydedildikten sonra yayınlanacaktır.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input 
                                id="title" 
                                value={form.data.title} 
                                onChange={e => form.setData('title', e.target.value)} 
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea 
                                id="description" 
                                value={form.data.description} 
                                onChange={e => form.setData('description', e.target.value)} 
                            />
                            <InputError message={form.errors.description} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select 
                                    value={form.data.category} 
                                    onValueChange={v => form.setData('category', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.category} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="condition">Durum</Label>
                                <Select 
                                    value={form.data.condition} 
                                    onValueChange={v => form.setData('condition', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditions.map(c => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.condition} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Fiyat (₺)</Label>
                            <Input 
                                id="price" 
                                type="number"
                                min="0"
                                max="99999999"
                                step="0.01"
                                value={form.data.price} 
                                onChange={e => {
                                    const value = parseFloat(e.target.value);
                                    if (value >= 0 && value <= 99999999) {
                                        form.setData('price', e.target.value);
                                    }
                                }} 
                            />
                            <InputError message={form.errors.price} />
                        </div>



                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeEditModal}>Vazgeç</Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Silme Modalı */}
            <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            İlanı Sil
                        </DialogTitle>
                        <DialogDescription>
                            Bu işlem geri alınamaz. İlanınız kalıcı olarak silinecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Bu ilanı silmek istediğinize emin misiniz?
                            </p>
                            {deleteProduct && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{deleteProduct.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatPrice(deleteProduct.price)}
                                    </p>
                                </div>
                            )}
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                Bu işlem geri alınamaz!
                            </p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDeleteModal}>
                                Vazgeç
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={handleDelete}
                                disabled={deleteForm.processing}
                            >
                                {deleteForm.processing ? 'Siliniyor...' : 'Evet, Sil'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Başarı Toast Notification */}
            {showSuccessToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Başarılı!</h4>
                            <p className="text-sm opacity-90">{toastMessage}</p>
                        </div>
                        <button 
                            onClick={() => setShowSuccessToast(false)}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Hata Toast Notification */}
            {showErrorToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold">Hata!</h4>
                            <p className="text-sm opacity-90">{toastMessage}</p>
                        </div>
                        <button 
                            onClick={() => setShowErrorToast(false)}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
