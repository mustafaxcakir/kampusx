import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface RegisterProps {
    universities: University[];
}

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type University = {
    id: number;
    name: string;
    email_domain: string;
};

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    university_id?: number;
};

export default function Register({ universities }: RegisterProps) {
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [emailError, setEmailError] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        university_id: undefined,
    });

    // E-posta değiştiğinde üniversiteyi bul
    useEffect(() => {
        if (data.email && data.email.endsWith('.edu.tr')) {
            const domain = data.email.split('@')[1];
            const university = universities.find(u => u.email_domain === domain);
            setSelectedUniversity(university || null);
            setData('university_id', university?.id);
            setEmailError('');
        } else if (data.email && !data.email.endsWith('.edu.tr')) {
            setEmailError('Sadece .edu.tr uzantılı e-posta adresleri kabul edilir.');
            setSelectedUniversity(null);
            setData('university_id', undefined);
        } else {
            setEmailError('');
            setSelectedUniversity(null);
            setData('university_id', undefined);
        }
    }, [data.email, universities, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.email.endsWith('.edu.tr')) {
            setEmailError('Sadece .edu.tr uzantılı e-posta adresleri kabul edilir.');
            return;
        }

        if (!selectedUniversity) {
            setEmailError('Geçerli bir üniversite e-posta adresi giriniz.');
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email || emailError} />
                        {data.email && !data.email.endsWith('.edu.tr') && (
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                ⚠️ Sadece .edu.tr uzantılı e-posta adresleri kabul edilir
                            </p>
                        )}
                        {selectedUniversity && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                                ✅ {selectedUniversity.name} otomatik olarak seçildi
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="university">Üniversite</Label>
                        <Select value={selectedUniversity?.id?.toString() || ''} disabled>
                            <SelectTrigger className={selectedUniversity ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}>
                                <SelectValue placeholder={selectedUniversity ? selectedUniversity.name : "E-posta adresinizi giriniz..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedUniversity && (
                                    <SelectItem value={selectedUniversity.id.toString()}>
                                        {selectedUniversity.name}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {!selectedUniversity && data.email && (
                            <p className="text-sm text-muted-foreground">
                                Geçerli bir .edu.tr e-posta adresi giriniz
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
