import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hesap silme',
        href: '/ayarlar/hesap-sil',
    },
];

export default function HesapSil() {
    const { auth } = usePage<SharedData>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, errors, delete: destroy, processing, recentlySuccessful } = useForm({
        password: '',
    });

    const handleFirstSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Şifre kontrolü
        if (!data.password.trim()) {
            return;
        }
        
        setShowConfirmation(true);
    };

    const deleteAccount = () => {
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.password) {
                    reset('password');
                    passwordInput.current?.focus();
                    setShowConfirmation(false);
                }
            },
        });
    };

    const cancelDeletion = () => {
        setShowConfirmation(false);
        setData('password', '');
    };

    const reset = (field: 'password') => {
        setData(field, '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hesap silme" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title="Hesap silme" 
                        description="Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz?" 
                    />

                    <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleFirstSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Şifrenizi onaylayın</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Hesabınızı silmek için şifrenizi girin"
                            />

                            <p className="text-sm text-muted-foreground">
                                Hesabınızı silmek için şifrenizi girmeniz gerekiyor.
                            </p>

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                variant="destructive"
                            >
                                Hesabımı silmek istiyorum
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-red-600">Hesap siliniyor...</p>
                            </Transition>
                        </div>
                    </form>

                    {/* Çift Onay Modal */}
                    <Transition
                        show={showConfirmation}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in-out"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800">
                            <div className="mb-4 flex items-center gap-3">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                                    Son Onay
                                </h3>
                            </div>
                            
                            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
                                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir. 
                                <br /><br />
                                <strong>Devam etmek istediğinizden emin misiniz?</strong>
                            </p>
                            
                            <div className="flex gap-3">
                                <Button
                                    onClick={cancelDeletion}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={deleteAccount}
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={processing}
                                >
                                    Evet, hesabımı sil
                                </Button>
                            </div>
                        </div>
                        </div>
                    </Transition>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
} 