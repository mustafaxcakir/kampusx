import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import OptimizedImage from '@/components/optimized-image';

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

export default function Ilanlarim() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState<any>(null);
    const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
    
    const form = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
    });
    
    const deleteForm = useForm({});

    useEffect(() => {
        fetch('/my-products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    // Intersection Observer ile görünür resimleri takip et
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const productId = parseInt(entry.target.getAttribute('data-product-id') || '0');
                        setVisibleImages(prev => new Set([...prev, productId]));
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Tüm ürün kartlarını gözlemle
        const cards = document.querySelectorAll('[data-product-id]');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [products]);

    const openEditModal = (product: any) => {
        setEditProduct(product);
        form.setData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            location: product.location,
        });
        setEditModal(true);
    };

    const closeEditModal = () => {
        setEditModal(false);
        setEditProduct(null);
        form.reset();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(`/products/${editProduct.id}`, {
            onSuccess: () => {
                // Ürünü güncelle
                const updated = form.data;
                setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...updated } : p));
                closeEditModal();
            },
        });
    };

    const openDeleteModal = (product: any) => {
        setDeleteProduct(product);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteModal(false);
        setDeleteProduct(null);
    };

    const handleDelete = () => {
        if (!deleteProduct) return;
        
        console.log('Silme işlemi başlatılıyor:', deleteProduct.id);
        
        // Inertia.js ile silme
        deleteForm.post(`/products/${deleteProduct.id}/delete`, {
            onSuccess: () => {
                console.log('İlan başarıyla silindi');
                setProducts(products.filter(p => p.id !== deleteProduct.id));
                closeDeleteModal();
            },
            onError: (errors) => {
                console.log('Silme hatası:', errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="İlanlarım" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">İlanlarım</h1>
                {loading ? (
                    <div>Yükleniyor...</div>
                ) : products.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">Henüz hiç ilanınız yok.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {products.map(product => (
                            <Card key={product.id} className="flex flex-col" data-product-id={product.id}>
                                <CardHeader>
                                    <CardTitle className="truncate text-base">{product.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-2">
                                    <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            visibleImages.has(product.id) ? (
                                                <OptimizedImage
                                                    src={"/storage/" + product.images[0]}
                                                    alt={product.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">Fotoğraf yok</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{product.description}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{product.category} • {product.condition}</div>
                                    <div className="font-bold text-primary mt-auto">
                                        {Number(product.price) % 1 === 0 
                                            ? Number(product.price).toFixed(0) 
                                            : Number(product.price).toFixed(2)
                                        } ₺
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
                                            <Pencil className="w-4 h-4 mr-1" /> Düzenle
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => openDeleteModal(product)}>
                                            <Trash2 className="w-4 h-4 mr-1" /> Sil
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Düzenle Modalı */}
            <Dialog open={editModal} onOpenChange={setEditModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>İlanı Düzenle</DialogTitle>
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
                        <div className="space-y-2">
                            <Label htmlFor="location">Konum</Label>
                            <Input 
                                id="location" 
                                value={form.data.location} 
                                onChange={e => form.setData('location', e.target.value)} 
                            />
                            <InputError message={form.errors.location} />
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
                                        {Number(deleteProduct.price) % 1 === 0 
                                            ? Number(deleteProduct.price).toFixed(0) 
                                            : Number(deleteProduct.price).toFixed(2)
                                        } ₺
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
        </AppLayout>
    );
}
