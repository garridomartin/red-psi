'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Professional, UserLocation } from '@/types';
import { calculateDistanceKm, formatDistance } from '@/lib/geo';
import { Compass, MapPin, MessageCircle, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ProfessionalsMapProps {
    professionals: Professional[];
    userLocation: UserLocation | null;
    onSelectProfessional?: (prof: Professional) => void;
}

export const ProfessionalsMap: React.FC<ProfessionalsMapProps> = ({
    professionals,
    userLocation,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersGroupRef = useRef<any>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);

    // Initialize and update map
    useEffect(() => {
        let isCancelled = false;

        const setupMap = async () => {
            if (!containerRef.current) return;

            try {
                // Dynamic import of Leaflet on the client
                const L = (await import('leaflet')).default;

                if (isCancelled) return;

                // If a map instance already exists, remove it before creating a new one
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }

                // Create Leaflet Map centered on Buenos Aires
                const map = L.map(containerRef.current, {
                    center: [-34.6037, -58.3816],
                    zoom: 12,
                    scrollWheelZoom: true,
                    zoomControl: true,
                });

                mapInstanceRef.current = map;

                // OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                    maxZoom: 19,
                }).addTo(map);

                // Feature group to hold all markers for easy bounding
                const featureGroup = L.featureGroup().addTo(map);
                markersGroupRef.current = featureGroup;

                // Add user location pin if available
                if (userLocation) {
                    const userIcon = L.divIcon({
                        className: 'user-pulse-pin',
                        html: `
              <div style="position: relative; width: 26px; height: 26px;">
                <div style="
                  position: absolute;
                  inset: 0;
                  border-radius: 50%;
                  background: rgba(76, 201, 240, 0.45);
                  animation: leaflet-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>
                <div style="
                  position: absolute;
                  top: 5px;
                  left: 5px;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #4cc9f0;
                  border: 2px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                "></div>
              </div>
            `,
                        iconSize: [26, 26],
                        iconAnchor: [13, 13],
                        popupAnchor: [0, -14],
                    });

                    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
                        icon: userIcon,
                    });
                    userMarker.bindPopup(`
            <div style="padding: 6px; font-family: system-ui, sans-serif; text-align: center;">
              <strong style="display:block; font-size: 12px; color: #111;">Tu ubicación</strong>
              <span style="font-size: 11px; color: #666;">Buscando psicólogos cercanos</span>
            </div>
          `);
                    featureGroup.addLayer(userMarker);
                }

                // Add psychologist markers
                professionals.forEach((prof) => {
                    if (!prof.lat || !prof.lng) return;

                    const borderColor = prof.is_featured ? '#F59E0B' : '#4CC9F0';
                    const badgeColor = prof.is_featured ? '#F59E0B' : '#4CC9F0';

                    const profIcon = L.divIcon({
                        className: 'psychologist-avatar-pin',
                        html: `
              <div style="
                position: relative;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: 3px solid ${borderColor};
                box-shadow: 0 4px 14px rgba(0,0,0,0.35);
                background: #111;
                cursor: pointer;
              ">
                <img 
                  src="${prof.photo_url}" 
                  alt="${prof.name}" 
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    display: block;
                  " 
                />
                <div style="
                  position: absolute;
                  bottom: -3px;
                  right: -3px;
                  width: 17px;
                  height: 17px;
                  background: ${badgeColor};
                  border: 2px solid #fff;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: #0b1118;
                  font-weight: 800;
                  font-family: system-ui, sans-serif;
                ">
                  ε
                </div>
              </div>
            `,
                        iconSize: [44, 44],
                        iconAnchor: [22, 22],
                        popupAnchor: [0, -24],
                    });

                    const distanceText = userLocation
                        ? formatDistance(
                              calculateDistanceKm(
                                  userLocation.lat,
                                  userLocation.lng,
                                  prof.lat,
                                  prof.lng,
                              ),
                          )
                        : null;

                    const waUrl = `https://wa.me/${prof.whatsapp_number || prof.contact_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${prof.name}, vi tu consultorio en el mapa de Psicologos La Plata y quisiera consultar disponibilidad.`)}`;

                    const popupHtml = `
            <div style="padding: 4px; font-family: system-ui, -apple-system, sans-serif; min-width: 220px; max-width: 260px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <img 
                  src="${prof.photo_url}" 
                  alt="${prof.name}" 
                  style="width: 44px; height: 44px; border-radius: 12px; object-fit: cover; border: 2px solid #4cc9f0;" 
                />
                <div style="overflow: hidden;">
                  <strong style="display: block; font-size: 12px; color: #111; line-height: 1.2;">${prof.name}</strong>
                  <span style="font-size: 10px; color: #666;">${prof.license} • ${prof.age} años</span>
                  <div style="margin-top: 2px;">
                    <span style="font-size: 9px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                      ${prof.modality}
                    </span>
                  </div>
                </div>
              </div>

              <div style="font-size: 11px; color: #444; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 4px; color: #555;">
                  📍 <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${prof.address}</span>
                </div>
                ${distanceText ? `<div style="font-weight: bold; color: #0284c7; margin-top: 2px;">🧭 ${distanceText}</div>` : ''}
              </div>

              <div style="display: flex; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <a 
                  href="/profesionales/${prof.slug}" 
                  style="flex: 1; text-align: center; font-size: 10px; font-weight: bold; color: #111; background: #f3f4f6; padding: 6px 4px; border-radius: 8px; text-decoration: none; border: 1px solid #ddd;"
                >
                  Ver Perfil
                </a>
                <a 
                  href="${waUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style="flex: 1; text-align: center; font-size: 10px; font-weight: bold; color: #fff; background: #10b981; padding: 6px 4px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 3px;"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          `;

                    const marker = L.marker([prof.lat, prof.lng], { icon: profIcon });
                    marker.bindPopup(popupHtml, { minWidth: 220, maxWidth: 280 });

                    marker.on('click', () => {
                        setSelectedProf(prof);
                    });

                    featureGroup.addLayer(marker);
                });

                // Fit map bounds to show all pins
                if (featureGroup.getLayers().length > 0) {
                    map.fitBounds(featureGroup.getBounds(), {
                        padding: [40, 40],
                        maxZoom: 14,
                    });
                }

                setIsMapReady(true);
            } catch (err) {
                console.error('Error initializing Leaflet map:', err);
            }
        };

        setupMap();

        return () => {
            isCancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [professionals, userLocation]);

    return (
        <div className='space-y-4'>
            {/* Map Canvas Container */}
            <div className='w-full h-[500px] sm:h-[550px] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-card bg-white dark:bg-neutral-900 relative'>
                <div ref={containerRef} className='w-full h-full z-0' />

                {!isMapReady && (
                    <div className='absolute inset-0 bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3'>
                        <RefreshCw className='w-8 h-8 text-primary-500 animate-spin' />
                        <p className='text-xs font-bold text-neutral-700 dark:text-neutral-300'>
                            Cargando mapa interactivo de consultorios...
                        </p>
                    </div>
                )}
            </div>

            {/* Quick selected professional bottom card preview */}
            {selectedProf && (
                <div className='bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-primary-400/50 shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <img
                            src={selectedProf.photo_url}
                            alt={selectedProf.name}
                            className='w-12 h-12 rounded-xl object-cover ring-2 ring-primary-400 shrink-0'
                        />
                        <div className='min-w-0'>
                            <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-50 truncate'>
                                {selectedProf.name}
                            </h4>
                            <p className='text-xs text-neutral-500 truncate flex items-center gap-1'>
                                <MapPin className='w-3.5 h-3.5 text-primary-500 shrink-0' />
                                <span>
                                    {selectedProf.address} (
                                    {selectedProf.neighborhood || selectedProf.city})
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                        <Link
                            href={`/profesionales/${selectedProf.slug}`}
                            className='py-2 px-3 text-xs font-bold rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100'
                        >
                            Ver perfil completo
                        </Link>
                        <a
                            href={`https://wa.me/${selectedProf.whatsapp_number || selectedProf.contact_phone.replace(/\D/g, '')}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='py-2 px-3 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm'
                        >
                            <MessageCircle className='w-3.5 h-3.5' />
                            <span>Contactar</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
