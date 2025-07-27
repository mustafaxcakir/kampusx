import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profil ayarları',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    surname: string;
    email: string;
    about: string;
    phone: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        surname: (auth.user as any).surname || '',
        email: auth.user.email,
        about: (auth.user as any).about || '',
        phone: (auth.user as any).phone || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Ad ve soyad kontrolü
        if (!data.name.trim()) {
            return;
        }
        
        if (!data.surname.trim()) {
            return;
        }

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profil ayarları" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profil bilgileri" description="Adınızı ve soyadınızı güncelleyebilirsiniz." />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Ad *</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="given-name"
                                    placeholder="Adınız"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="surname">Soyad *</Label>

                                <Input
                                    id="surname"
                                    className="mt-1 block w-full"
                                    value={data.surname}
                                    onChange={(e) => setData('surname', e.target.value)}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Soyadınız"
                                />

                                <InputError className="mt-2" message={errors.surname} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-posta adresi</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full bg-muted"
                                value={data.email}
                                readOnly
                                disabled
                                autoComplete="username"
                                placeholder="E-posta adresi"
                            />

                            <p className="text-sm text-muted-foreground">
                                E-posta adresi değiştirilemez. Güvenlik nedeniyle bu alan kilitlidir.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Cep telefon numarası</Label>

                            <Input
                                id="phone"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="tel"
                                placeholder="Örn: 0555 123 12 34 veya +90 555 123 12 34"
                            />

                            <p className="text-sm text-muted-foreground">
                                Telefon numaranızı giriniz. Örnek: 0555 123 12 34, +90 555 123 12 34, +1 555 123 4567
                            </p>

                            <InputError className="mt-2" message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="about">Hakkımda (isteğe bağlı)</Label>

                            <textarea
                                id="about"
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.about}
                                onChange={(e) => setData('about', e.target.value)}
                                rows={4}
                                maxLength={250}
                                placeholder="Kendiniz hakkında kısa bir bilgi yazabilirsiniz... (maksimum 250 karakter)"
                            />

                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <InputError message={errors.about} />
                                <span className={`${data.about.length > 200 ? 'text-orange-500' : ''} ${data.about.length > 240 ? 'text-red-500' : ''}`}>
                                    {data.about.length}/250
                                </span>
                            </div>
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    E-posta adresiniz doğrulanmamış.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Doğrulama e-postasını tekrar göndermek için tıklayın.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Yeni bir doğrulama bağlantısı e-posta adresinize gönderildi.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Kaydet</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Kaydedildi</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
