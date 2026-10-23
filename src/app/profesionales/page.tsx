'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getProfessionals } from '@/lib/data/dataStore';
import { Professional, FilterState, UserLocation } from '@/types';
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard';
import { FiltersPanel } from '@/components/professionals/FiltersPanel';
import { ProfessionalsMap } from '@/components/professionals/ProfessionalsMap';
import { calculateDistanceKm, requestBrowserLocation } from '@/lib/geo';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  LayoutGrid,
  Map as MapIcon,
  Search,
  Sparkles,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

const initialFilters: FilterState = {
  searchQuery: '',
  gender: 'all',
  ageRange: 'all',
  specialty: 'all',
  insurance: 'all',
  modality: 'all',
  sortByProximity: false,
};

export default function ProfessionalsPage() {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Load professionals & saved location
  useEffect(() => {
    setProfessionals(getProfessionals());
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      const savedLoc = localStorage.getItem('red_epsilon_user_location_v1');
      if (savedLoc) {
        try {
          setUserLocation(JSON.parse(savedLoc));
        } catch {}
      }
    }
  }, []);

  const handleRequestLocation = async () => {
    try {
      const loc = await requestBrowserLocation();
      setUserLocation(loc);
      localStorage.setItem('red_epsilon_user_location_v1', JSON.stringify(loc));
      setFilters((prev) => ({ ...prev, sortByProximity: true }));
    } catch (err: any) {
      alert(err.message || 'No se pudo activar la ubicación.');
    }
  };

  // Filter & sort logic
  const filteredProfessionals = useMemo(() => {
    let result = professionals.filter((p) => p.is_active);

    // Text search (name or specialties or neighborhood)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.specialties.some((s) => s.toLowerCase().includes(query)) ||
          (p.neighborhood && p.neighborhood.toLowerCase().includes(query)) ||
          p.bio.toLowerCase().includes(query)
      );
    }

    // Gender filter
    if (filters.gender !== 'all') {
      result = result.filter((p) => p.gender === filters.gender);
    }

    // Modality filter
    if (filters.modality !== 'all') {
      if (filters.modality === 'ambas') {
        result = result.filter((p) => p.modality === 'ambas');
      } else {
        result = result.filter((p) => p.modality === filters.modality || p.modality === 'ambas');
      }
    }

    // Specialty filter
    if (filters.specialty !== 'all') {
      result = result.filter((p) => p.specialties.includes(filters.specialty));
    }

    // Insurance filter
    if (filters.insurance !== 'all') {
      result = result.filter((p) => p.insurances.includes(filters.insurance));
    }

    // Age range filter
    if (filters.ageRange !== 'all') {
      if (filters.ageRange === '20-35') {
        result = result.filter((p) => p.age >= 20 && p.age <= 35);
      } else if (filters.ageRange === '36-49') {
        result = result.filter((p) => p.age >= 36 && p.age <= 49);
      } else if (filters.ageRange === '50+') {
        result = result.filter((p) => p.age >= 50);
      }
    }

    // Sort by proximity
    if (filters.sortByProximity && userLocation) {
      result = [...result].sort((a, b) => {
        const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return result;
  }, [professionals, filters, userLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-400/20 text-neutral-900 dark:text-neutral-100 mb-2">
            <Compass className="w-3.5 h-3.5 text-primary-500" />
            <span>Directorio de Profesionales</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50">
            Encontrá tu terapeuta ideal
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
            Explorá tarjetas profesionales, compará enfoques, obras sociales y distancias a tu ubicación.
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
              viewMode === 'grid'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Tarjetas</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
              viewMode === 'map'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent shadow-sm'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Mapa</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Cards / Map */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <FiltersPanel
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(initialFilters)}
          userLocation={userLocation}
          onRequestLocation={handleRequestLocation}
          totalResults={filteredProfessionals.length}
        />

        {/* Results Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Active status bar */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Mostrando <strong className="text-neutral-900 dark:text-neutral-100">{filteredProfessionals.length}</strong> profesionales activos
            </span>
            {filters.sortByProximity && userLocation && (
              <span className="text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Ordenados de menor a mayor distancia
              </span>
            )}
          </div>

          {/* Cards Grid */}
          {viewMode === 'grid' && (
            <>
              {filteredProfessionals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProfessionals.map((prof) => (
                    <ProfessionalCard
                      key={prof.id}
                      professional={prof}
                      userLocation={userLocation}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    No encontramos profesionales con esos filtros
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Probá cambiando o ampliando tus criterios de búsqueda, obra social o modalidad.
                  </p>
                  <button
                    onClick={() => setFilters(initialFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-primary-400 text-neutral-950 hover:bg-primary-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer todos los filtros</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <div>
                  <h3 className="font-bold text-sm font-display text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary-500" />
                    <span>Mapa interactivo de consultorios</span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Hacé clic en cualquier foto o pin para abrir la ficha de contacto y dirección.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-800 dark:text-primary-300 self-start sm:self-auto">
                  {filteredProfessionals.length} consultorios en el mapa
                </span>
              </div>

              <ProfessionalsMap
                professionals={filteredProfessionals}
                userLocation={userLocation}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
