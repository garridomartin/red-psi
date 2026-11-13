'use client';

interface Option<T extends string> {
    id: T;
    label: string;
}

interface CheckboxGroupProps<T extends string> {
    options: readonly Option<T>[];
    selected: readonly T[];
    onToggle: (id: T) => void;
    gridClassName?: string;
}

export default function CheckboxGroup<T extends string>({
    options,
    selected,
    onToggle,
    gridClassName = 'grid-cols-2 sm:grid-cols-3',
}: CheckboxGroupProps<T>) {
    return (
        <div className={`grid ${gridClassName} gap-2`}>
            {options.map((opt) => {
                const checked = selected.includes(opt.id);
                return (
                    <label
                        key={opt.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                            checked
                                ? 'bg-primary-400/20 border-primary-400 text-neutral-900 dark:text-neutral-100 font-semibold'
                                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                    >
                        <input
                            type='checkbox'
                            checked={checked}
                            onChange={() => onToggle(opt.id)}
                            className='rounded text-primary-500 focus:ring-primary-400'
                        />
                        <span className='truncate'>{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
}
