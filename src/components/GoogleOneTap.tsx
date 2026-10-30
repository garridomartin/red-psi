'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        google?: any;
    }
}

interface GoogleOneTapProps {
    onCredential: (credential: string) => Promise<void> | void;
    onError?: (message: string) => void;
}

export function GoogleOneTap({ onCredential, onError }: GoogleOneTapProps) {
    const initialized = useRef(false);
    const buttonDiv = useRef<HTMLDivElement>(null);
    const isProcessing = useRef(false);
    // Para no re-inicializar si cambian los callbacks entre renders:
    const onCredentialRef = useRef(onCredential);
    const onErrorRef = useRef(onError);
    onCredentialRef.current = onCredential;
    onErrorRef.current = onError;

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) return;
        if (initialized.current) return;
        initialized.current = true; // síncrono, arregla el warning de initialize()

        const handleCredentialResponse = async (response: { credential: string }) => {
            if (isProcessing.current) return;
            if (!response?.credential) {
                onErrorRef.current?.('No se recibió credencial de Google');
                return;
            }
            isProcessing.current = true;
            try {
                await onCredentialRef.current(response.credential);
            } catch (err: any) {
                onErrorRef.current?.(err.message || 'No se pudo iniciar sesión');
            } finally {
                isProcessing.current = false;
            }
        };

        const loadScript = () =>
            new Promise<void>((resolve, reject) => {
                if (window.google?.accounts?.id) {
                    resolve();
                    return;
                }
                const existing = document.querySelector(
                    'script[src="https://accounts.google.com/gsi/client"]',
                );
                if (existing) {
                    existing.addEventListener('load', () => resolve());
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = () =>
                    reject(new Error('No se pudo cargar Google Identity Services'));
                document.head.appendChild(script);
            });

        loadScript()
            .then(() => {
                if (!window.google?.accounts?.id) return;

                // Inicializamos el cliente de Google
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    use_fedcm_for_prompt: true, // <-- AGREGÁ ESTO
                });

                // ❌ ACÁ BORRAMOS EL window.google.accounts.id.prompt()
                // Ya no intentamos mostrar One Tap automático.

                // ✅ SOLO renderizamos el botón estándar de Google
                if (buttonDiv.current) {
                    window.google.accounts.id.renderButton(buttonDiv.current, {
                        theme: 'outline',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rectangular',
                        width: 320,
                        logo_alignment: 'left',
                    });
                }

                initialized.current = true;
            })
            .catch((err) => {
                console.error(err);
                onError?.(err.message);
            });
    }, []);

    return (
        <div className='flex flex-col items-center justify-center min-h-[50px]'>
            <div ref={buttonDiv} id='google-signin-button' />
        </div>
    );
}
