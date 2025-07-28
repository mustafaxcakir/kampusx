import { useState } from 'react';
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
        setSelectedImages(files);
        form.setData('images', files);

        // Preview oluştur
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreview(newPreviews);
        form.setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('products.store'), {
            onSuccess: () => {
                form.reset();
                setSelectedImages([]);
                setImagePreview([]);
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
                                                step="0.01"
                                                value={form.data.price}
                                                onChange={(e) => form.setData('price', e.target.value)}
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
                                        Ürününüzün fotoğraflarını ekleyin (En fazla 5 adet)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Fotoğraf Yükleme Alanı */}
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <Label htmlFor="images" className="cursor-pointer">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Fotoğraf seçmek için tıklayın
                                            </span>
                                        </Label>
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Fotoğraf Önizlemeleri */}
                                    {imagePreview.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                Seçilen Fotoğraflar
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {imagePreview.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
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
                                        {form.processing ? 'İlan Veriliyor...' : 'İlanı Yayınla'}
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
