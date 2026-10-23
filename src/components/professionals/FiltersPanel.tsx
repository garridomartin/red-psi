'use client';

import React, { useState } from 'react';
import { FilterState, Specialty, Insurance, UserLocation } from '@/types';
import { SPECIALTIES_CATALOG, INSURANCES_CATALOG } from '@/lib/data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FiltersPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  userLocation: UserLocation | null;
  onRequestLocation: () => void;
  totalResults: number;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  userLocation,
  onRequestLocation,
  totalResults,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeCount = [
    filters.gender !== 'all',
    filters.ageRange !== 'all',
    filters.specialty !== 'all',
    filters.insurance !== 'all',
    filters.modality !== 'all',
    filters.sortByProximity,
    Boolean(filters.searchQuery.trim()),
  ].filter(Boolean).length;

  const handleProximityToggle = () => {
    if (!filters.sortByProximity && !userLocation) {
      onRequestLocation();
      return;
    }
    onFilterChange({
      ...filters,
      sortByProximity: !filters.sortByProximity,
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Buscar por nombre o tema
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ej: Sofía, Ansiedad, Pareja..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all shadow-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Proximity Toggle */}
      <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-900/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-primary-500" />
            Ordenar por cercanía
          </span>
          <button
            type="button"
            onClick={handleProximityToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              filters.sortByProximity ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
            role="switch"
            aria-checked={filters.sortByProximity}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                filters.sortByProximity ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight">
          {userLocation
            ? 'Ubicación GPS activa. Muestra los consultorios más cercanos primero.'
            : 'Requiere permiso de ubicación para calcular distancias exactas.'}
        </p>
      </div>

      {/* Specialty Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Especialidad / Enfoque
        </label>
        <select
          value={filters.specialty}
          onChange={(e) => onFilterChange({ ...filters, specialty: e.target.value })}
          className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="all">Todas las especialidades</option>
          {SPECIALTIES_CATALOG.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Modality Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Modalidad de atención
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'online', label: 'Online' },
            { id: 'presencial', label: 'Presencial' },
            { id: 'ambas', label: 'Ambas' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onFilterChange({ ...filters, modality: mode.id })}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                filters.modality === mode.id
                  ? 'bg-primary-400/20 text-neutral-900 dark:text-neutral-100 border-primary-400 font-bold'
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insurance Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Obra Social o Prepaga
        </label>
        <select
          value={filters.insurance}
          onChange={(e) => onFilterChange({ ...filters, insurance: e.target.value })}
          className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="all">Todas las obras sociales / Particular</option>
          {INSURANCES_CATALOG.map((ins) => (
            <option key={ins.id} value={ins.name}>
              {ins.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Género del terapeuta
        </label>
        <select
          value={filters.gender}
          onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
          className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="all">Todos los géneros</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="no-binario">No binario</option>
        </select>
      </div>

      {/* Age Range Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
          Rango de edad
        </label>
        <select
          value={filters.ageRange}
          onChange={(e) => onFilterChange({ ...filters, ageRange: e.target.value })}
          className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="all">Cualquier edad</option>
          <option value="20-35">20 a 35 años (Jóvenes profesionales)</option>
          <option value="36-49">36 a 49 años (Media trayectoria)</option>
          <option value="50+">50+ años (Senior / Especialistas)</option>
        </select>
      </div>

      {/* Reset button */}
      {activeCount > 0 && (
        <button
          onClick={onResetFilters}
          className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer filtros ({activeCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-card sticky top-28 self-start max-h-[calc(100vh-140px)] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70 dark:border-neutral-800 mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary-500" />
            <h3 className="font-bold text-sm font-display text-neutral-900 dark:text-neutral-100">
              Filtros de búsqueda
            </h3>
          </div>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-400 text-neutral-950">
              {activeCount}
            </span>
          )}
        </div>
        {filterContent}
      </aside>

      {/* Mobile Trigger Button */}
      <div className="lg:hidden flex items-center justify-between gap-3 w-full mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar profesional o tema..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="py-2.5 px-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold shadow-sm flex items-center gap-2 shrink-0"
        >
          <Filter className="w-4 h-4 text-primary-500" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-400 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Modal / Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-neutral-50 dark:bg-neutral-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary-500" />
                  <h3 className="font-bold text-sm font-display text-neutral-900 dark:text-neutral-100">
                    Filtros ({totalResults} resultados)
                  </h3>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-6">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full py-3 rounded-2xl bg-primary-400 text-neutral-950 font-bold text-xs shadow-md"
              >
                Ver {totalResults} profesionales
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
