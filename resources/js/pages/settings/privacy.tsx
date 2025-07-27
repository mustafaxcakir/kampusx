import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Globe, Lock, Users as UsersIcon, Shield } from 'lucide-react';

interface PrivacyForm {
    email_privacy: 'public' | 'members' | 'private';
    phone_privacy: 'public' | 'members' | 'private';
    university_privacy: 'public' | 'members' | 'private';
    [key: string]: any;
}

const breadcrumbs = [
    { title: 'Ayarlar', href: '/ayarlar' },
    { title: 'Gizlilik ayarları', href: '/ayarlar/gizlilik' },
];

export default function Privacy() {
    const { privacySettings } = usePage<{ privacySettings: any }>().props;
    
    const form = useForm<any>({
        email_privacy: privacySettings?.email_privacy || 'private',
        phone_privacy: privacySettings?.phone_privacy || 'private',
        university_privacy: privacySettings?.university_privacy || 'public',
    });
    
    const { data, patch, processing, errors } = form as any;
    const setData = (key: string, value: any) => (form as any).setData(key, value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.privacy.update'));
    };

    const privacyOptions = [
        { value: 'public', label: 'Herkese Açık' },
        { value: 'members', label: 'Sadece Üyeler' },
        { value: 'private', label: 'Gizli' },
    ];

    return (
        <AppLayout>
            <Head title="Gizlilik ayarları" />
            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Gizlilik Ayarları</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Profil bilgilerinizin kimler tarafından görülebileceğini belirleyin.
                        </p>
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                <Shield className="w-4 h-4" />
                                <span className="font-medium">Gizlilik Seviyeleri</span>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-green-600" />
                                    <span>Herkese Açık</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UsersIcon className="w-3 h-3 text-blue-600" />
                                    <span>Sadece Üyeler</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-red-600" />
                                    <span>Gizli</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Üniversite Gizliliği */}
                        <div className="space-y-2">
                            <Label htmlFor="university_privacy">Üniversite</Label>
                            <Select
                                value={data.university_privacy}
                                onValueChange={(value: 'public' | 'members' | 'private') => 
                                    setData('university_privacy', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {privacyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.value === 'public' && <Globe className="w-4 h-4 text-green-600" />}
                                                {option.value === 'members' && <UsersIcon className="w-4 h-4 text-blue-600" />}
                                                {option.value === 'private' && <Lock className="w-4 h-4 text-red-600" />}
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.university_privacy} className="mt-2" />
                        </div>

                        {/* E-posta Gizliliği */}
                        <div className="space-y-2">
                            <Label htmlFor="email_privacy">E-posta Adresi</Label>
                            <Select
                                value={data.email_privacy}
                                onValueChange={(value: 'public' | 'members' | 'private') => 
                                    setData('email_privacy', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {privacyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.value === 'public' && <Globe className="w-4 h-4 text-green-600" />}
                                                {option.value === 'members' && <UsersIcon className="w-4 h-4 text-blue-600" />}
                                                {option.value === 'private' && <Lock className="w-4 h-4 text-red-600" />}
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.email_privacy} className="mt-2" />
                        </div>

                        {/* Telefon Gizliliği */}
                        <div className="space-y-2">
                            <Label htmlFor="phone_privacy">Telefon Numarası</Label>
                            <Select
                                value={data.phone_privacy}
                                onValueChange={(value: 'public' | 'members' | 'private') => 
                                    setData('phone_privacy', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {privacyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                {option.value === 'public' && <Globe className="w-4 h-4 text-green-600" />}
                                                {option.value === 'members' && <UsersIcon className="w-4 h-4 text-blue-600" />}
                                                {option.value === 'private' && <Lock className="w-4 h-4 text-red-600" />}
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.phone_privacy} className="mt-2" />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
} 