import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Image as ImageIcon, Package, MapPin, DollarSign, FileText } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'İlan Ver',
        href: '/ilanver',
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

export default function IlanVer() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});

    // Component unmount olduğunda URL'leri temizle
    useEffect(() => {
        return () => {
            imagePreview.forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    const form = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        images: [] as File[],
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Toplam dosya sayısı kontrolü
        if (selectedImages.length + files.length > 5) {
            alert('Maksimum 5 fotoğraf yükleyebilirsiniz.');
            return;
        }
        
        // Güvenlik kontrolleri
        const validFiles = files.filter(file => {
            // Dosya türü kontrolü
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert(`${file.name} geçersiz dosya türü. Sadece JPEG ve PNG dosyaları kabul edilir.`);
                return false;
            }
            
            // Dosya boyutu kontrolü (10MB - sıkıştırma öncesi maksimum)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert(`${file.name} çok büyük. Maksimum dosya boyutu 10MB olmalıdır.`);
                return false;
            }
            
            return true;
        });
        
        if (validFiles.length > 0) {
            const newImages = [...selectedImages, ...validFiles];
            setSelectedImages(newImages);
            form.setData('images', newImages);

            // Preview oluştur
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreview([...imagePreview, ...newPreviews]);
        }
        
        // Input'u temizle (aynı dosyayı tekrar seçebilmek için)
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        // URL'yi temizle
        URL.revokeObjectURL(imagePreview[index]);
        
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreview(newPreviews);
        form.setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Yükleme durumunu başlat
        const uploadStates: { [key: string]: boolean } = {};
        selectedImages.forEach((file, index) => {
            uploadStates[`${file.name}_${index}`] = true;
        });
        setUploadingImages(uploadStates);
        
        form.post(route('products.store'), {
            onSuccess: () => {
                form.reset();
                setSelectedImages([]);
                setImagePreview([]);
                setUploadingImages({});
            },
            onError: () => {
                setUploadingImages({});
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="İlan Ver" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Yeni İlan Ver</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ürününüzü satışa çıkarın ve kampüs içinde alıcılarla buluşturun
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Sol Kolon - Ana Bilgiler */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ürün Bilgileri */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Ürün Bilgileri
                                    </CardTitle>
                                    <CardDescription>
                                        Ürününüzün temel bilgilerini girin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-900 dark:text-gray-100">
                                            Ürün Adı *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={form.data.title}
                                            onChange={(e) => form.setData('title', e.target.value)}
                                            placeholder="Örn: MacBook Pro 2023"
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                        />
                                        <InputError message={form.errors.title} className="mt-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                                            Açıklama *
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={form.data.description}
                                            onChange={(e) => form.setData('description', e.target.value)}
                                            placeholder="Ürününüzün detaylı açıklamasını yazın..."
                                            rows={4}
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                        />
                                        <InputError message={form.errors.description} className="mt-1" />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="text-gray-900 dark:text-gray-100">
                                                Kategori *
                                            </Label>
                                            <Select
                                                value={form.data.category}
                                                onValueChange={(value) => form.setData('category', value)}
                                            >
                                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectValue placeholder="Kategori seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={form.errors.category} className="mt-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="condition" className="text-gray-900 dark:text-gray-100">
                                                Durum *
                                            </Label>
                                            <Select
                                                value={form.data.condition}
                                                onValueChange={(value) => form.setData('condition', value)}
                                            >
                                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectValue placeholder="Durum seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {conditions.map((condition) => (
                                                        <SelectItem key={condition.value} value={condition.value}>
                                                            {condition.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={form.errors.condition} className="mt-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fiyat ve Konum */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Fiyat ve Konum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-gray-900 dark:text-gray-100">
                                                Fiyat (₺) *
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                max="99999999"
                                                step="0.01"
                                                value={form.data.price}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    if (value >= 0 && value <= 99999999) {
                                                        form.setData('price', e.target.value);
                                                    }
                                                }}
                                                placeholder="100"
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                            <InputError message={form.errors.price} className="mt-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-gray-900 dark:text-gray-100">
                                                <MapPin className="h-4 w-4 inline mr-1" />
                                                Konum
                                            </Label>
                                            <Input
                                                id="location"
                                                value={form.data.location}
                                                onChange={(e) => form.setData('location', e.target.value)}
                                                placeholder="Örn: A Blok, Merkez Kampüs"
                                                className="dark:bg-gray-800 dark:border-gray-700"
                                            />
                                            <InputError message={form.errors.location} className="mt-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sağ Kolon - Fotoğraflar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Fotoğraflar
                                    </CardTitle>
                                    <CardDescription>
                                        Ürününüzün fotoğraflarını ekleyin (En fazla 5 adet, otomatik sıkıştırılır)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Fotoğraf Yükleme Alanı */}
                                    <div className={`border border-dashed rounded-lg p-4 text-center transition-colors ${
                                        form.processing 
                                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                    }`}>
                                        <Upload className={`mx-auto h-6 w-6 mb-2 ${
                                            form.processing ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400'
                                        }`} />
                                        
                                        <Label htmlFor="images" className={`block cursor-pointer ${
                                            form.processing ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}>
                                            <span className={`text-sm ${
                                                form.processing 
                                                    ? 'text-gray-400 dark:text-gray-500' 
                                                    : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {form.processing ? 'Yükleniyor...' : 'Fotoğraf ekle'}
                                            </span>
                                        </Label>
                                        
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={handleImageChange}
                                            disabled={form.processing}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Fotoğraf Önizlemeleri */}
                                    {imagePreview.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {imagePreview.length} fotoğraf seçildi
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {imagePreview.map((preview, index) => {
                                                    const fileKey = `${selectedImages[index]?.name}_${index}`;
                                                    const isUploading = uploadingImages[fileKey];
                                                    
                                                    return (
                                                        <div key={index} className="relative group">
                                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className={`w-full h-full object-cover transition-all duration-200 ${
                                                                        isUploading ? 'opacity-40' : 'opacity-100'
                                                                    }`}
                                                                />
                                                                
                                                                {/* Yükleme Overlay */}
                                                                {isUploading && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Silme Butonu */}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                disabled={isUploading}
                                                                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                                    isUploading 
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                                        : 'bg-red-500 text-white hover:bg-red-600 hover:scale-110 opacity-0 group-hover:opacity-100'
                                                                }`}
                                                            >
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* İlan Verme Butonu */}
                            <Card>
                                <CardContent className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {form.processing ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>İlan Veriliyor...</span>
                                            </div>
                                        ) : (
                                            'İlanı Yayınla'
                                        )}
                                    </Button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                        İlanınız onaylandıktan sonra yayınlanacaktır
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
