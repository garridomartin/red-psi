import { Professional, Specialty, Insurance, Article } from '@/types';

export const SPECIALTIES_CATALOG: Specialty[] = [
    {
        id: '1',
        name: 'Terapia Cognitivo Conductual (TCC)',
        slug: 'tcc',
        description:
            'Enfoque práctico y orientado a metas para modificar patrones de pensamiento y conducta.',
    },
    {
        id: '2',
        name: 'Psicoanálisis',
        slug: 'psicoanalisis',
        description: 'Exploración del inconsciente, la historia vincular y los deseos profundos.',
    },
    {
        id: '3',
        name: 'Psicología Perinatal',
        slug: 'perinatal',
        description:
            'Acompañamiento en fertilidad, embarazo, puerperio y primeros años de crianza.',
    },
    {
        id: '4',
        name: 'Trauma y EMDR',
        slug: 'trauma-emdr',
        description: 'Procesamiento de vivencias traumáticas y desensibilización emocional.',
    },
    {
        id: '5',
        name: 'Terapia de Pareja',
        slug: 'parejas',
        description:
            'Comunicación asertiva, acuerdos vinculares y superación de conflictos en pareja.',
    },
    {
        id: '6',
        name: 'Terapia Sistémica',
        slug: 'sistemica',
        description: 'Análisis de dinámicas familiares, roles y sistemas relacionales.',
    },
    {
        id: '7',
        name: 'Mindfulness y ACT',
        slug: 'mindfulness-act',
        description:
            'Terapia de Aceptación y Compromiso, flexibilidad psicológica y atención plena.',
    },
    {
        id: '8',
        name: 'Neuropsicología y Cognición',
        slug: 'neuropsicologia',
        description: 'Evaluación y estimulación de funciones cerebrales y procesos cognitivos.',
    },
    {
        id: '9',
        name: 'Diversidad y Género',
        slug: 'diversidad-genero',
        description:
            'Espacio seguro y afirmativo para la comunidad LGBTIQ+ y diversidad de género.',
    },
];

export const INSURANCES_CATALOG: Insurance[] = [
    { id: '1', name: 'Particular', slug: 'particular', category: 'particular' },
    { id: '2', name: 'AMFFA', slug: 'amffa', category: 'obra-social' },
    { id: '3', name: 'AVALIAN', slug: 'avalian', category: 'obra-social' },
    { id: '4', name: 'COMEI', slug: 'comei', category: 'obra-social' },
    { id: '5', name: 'DASUTEN', slug: 'dasuten', category: 'obra-social' },
    { id: '6', name: 'OSCAP', slug: 'oscap', category: 'obra-social' },
    { id: '7', name: 'MUTUAL FEDERADA', slug: 'mutual-federada', category: 'obra-social' },
    { id: '8', name: 'OSFATUN', slug: 'osfatun', category: 'obra-social' },
    { id: '9', name: 'OSPE', slug: 'ospe', category: 'obra-social' },
    { id: '10', name: 'OSPJN', slug: 'ospjn', category: 'obra-social' },
    { id: '11', name: 'PRIMEDIC', slug: 'primedic', category: 'obra-social' },
    { id: '12', name: 'SADAIC', slug: 'sadaic', category: 'obra-social' },
    { id: '13', name: 'PEQUEÑA FAMILIA', slug: 'fequena-familia', category: 'obra-social' },
    { id: '14', name: 'OSDE', slug: 'osde', category: 'prepaga' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
    {
        id: 'prof-1',
        name: 'Lic. Sofía Valenzuela',
        slug: 'lic-sofia-valenzuela',
        title: 'Licenciada en Psicología (UBA, Diploma de Honor)',
        license: 'M.N. 48.912',
        bio: 'Licenciada en Psicología con más de 9 años de experiencia clínica especializada en Terapia Cognitivo Conductual (TCC). Me apasiona brindar un espacio cálido, estructurado y basado en evidencia donde puedas comprender tus patrones de pensamiento, gestionar la ansiedad y recuperar el bienestar en tu vida diaria. Trabajo activamente con técnicas de reestructuración cognitiva y mindfulness.',
        photo_url:
            'https://images.unsplash.com/photo-1594824813583-366a7ec65137?auto=format&fit=crop&w=800&q=80',
        gender: 'femenino',
        age: 34,
        birth_date: '1990-04-12',
        specialties: [
            'Terapia Cognitivo Conductual (TCC)',
            'Ansiedad y Estrés',
            'Mindfulness y ACT',
        ],
        insurances: ['OSDE', 'Swiss Medical', 'Particular'],
        modality: 'ambas',
        address: 'Av. Santa Fe 3200, Palermo, CABA',
        neighborhood: 'Palermo',
        city: 'Buenos Aires',
        lat: -34.5885,
        lng: -58.4112,
        instagram_url: 'https://instagram.com/lic.sofiavalenzuela',
        contact_email: 'sofia.valenzuela.psi@gmail.com',
        contact_phone: '+5491145678901',
        whatsapp_number: '5491145678901',
        is_active: true,
        is_featured: true,
        session_price: '$22.000 / sesión',
        example: null,
        approach: 'Cognitivo-Conductual y Mindfulness',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-06-01T12:00:00Z',
    },
    {
        id: 'prof-2',
        name: 'Lic. Martín Echeverría',
        slug: 'lic-martin-echeverria',
        title: 'Psicólogo Clínico (UBA) - Miembro APdeBA',
        license: 'M.N. 39.420',
        bio: 'Más de 15 años de trayectoria en el abordaje psicoanalítico contemporáneo. Propongo un espacio de escucha atenta y sin juicios para desentrañar aquellos conflictos que generan malestar, repetición y angustia. Mi foco está en la singularidad de cada paciente, habilitando nuevas preguntas y caminos hacia una vida más plena y consciente.',
        photo_url:
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
        gender: 'masculino',
        age: 42,
        birth_date: '1982-08-25',
        specialties: ['Psicoanálisis', 'Depresión y Duelo', 'Terapia de Pareja'],
        insurances: ['OSDE', 'Galeno', 'Particular'],
        modality: 'presencial',
        address: 'Av. Corrientes 4500, Almagro, CABA',
        neighborhood: 'Almagro',
        city: 'Buenos Aires',
        lat: -34.6042,
        lng: -58.4278,
        instagram_url: 'https://instagram.com/lic.martinecheverria',
        contact_email: 'martin.echeverria@redpsicologos.com',
        contact_phone: '+5491156789012',
        whatsapp_number: '5491156789012',
        is_active: true,
        is_featured: true,
        session_price: '$25.000 / sesión',
        example: null,
        approach: 'Psicoanálisis Contemporáneo',
        created_at: '2024-01-18T11:00:00Z',
        updated_at: '2024-06-02T15:00:00Z',
    },
    {
        id: 'prof-3',
        name: 'Lic. Camila Restrepo',
        slug: 'lic-camila-restrepo',
        title: 'Psicóloga Sistémica & Terapeuta Familiar',
        license: 'M.N. 53.118',
        bio: 'Especialista en terapia vincular y dinámica familiar. Trabajo con parejas y personas individuales que desean mejorar su comunicación, resolver crisis afectivas y establecer acuerdos saludables. Atención 100% online con amplia flexibilidad horaria tanto para residentes de Argentina como personas viviendo en el exterior.',
        photo_url:
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
        gender: 'femenino',
        age: 29,
        birth_date: '1995-11-14',
        specialties: ['Terapia Sistémica', 'Terapia de Pareja'],
        insurances: ['Medifé', 'Swiss Medical', 'Particular'],
        modality: 'online',
        address: 'Av. Cabildo 2100, Belgrano, CABA',
        neighborhood: 'Belgrano',
        city: 'Buenos Aires',
        lat: -34.5623,
        lng: -58.4561,
        instagram_url: 'https://instagram.com/camila.psicologia',
        contact_email: 'lic.camila.restrepo@gmail.com',
        contact_phone: '+5491167890123',
        whatsapp_number: '5491167890123',
        is_active: true,
        is_featured: true,
        session_price: '$20.000 / sesión',
        example: null,
        approach: 'Sistémico y Relacional',
        created_at: '2024-02-01T09:30:00Z',
        updated_at: '2024-06-03T10:00:00Z',
    },
    {
        id: 'prof-4',
        name: 'Dr. Alejandro Gómez Benítez',
        slug: 'dr-alejandro-gomez-benitez',
        title: 'Doctor en Psicología y Neuropsicología Clínica',
        license: 'M.N. 31.804',
        bio: 'Especializado en diagnóstico neuropsicológico, funciones ejecutivas y estimulación cognitiva en adultos y adultos mayores. Más de 20 años en docencia e investigación clínica. Realizo evaluaciones integrales de memoria, atención y lenguaje para brindar estrategias terapéuticas de alto impacto en la calidad de vida.',
        photo_url:
            'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
        gender: 'masculino',
        age: 54,
        birth_date: '1970-03-05',
        specialties: ['Neuropsicología y Cognición', 'Depresión y Duelo'],
        insurances: ['OSDE', 'IOMA', 'Galeno', 'Particular'],
        modality: 'presencial',
        address: 'Av. Rivadavia 6200, Caballito, CABA',
        neighborhood: 'Caballito',
        city: 'Buenos Aires',
        lat: -34.6234,
        lng: -58.4452,
        instagram_url: 'https://instagram.com/dr.alejandrogomez',
        contact_email: 'gomez.benitez.neuro@gmail.com',
        contact_phone: '+5491178901234',
        whatsapp_number: '5491178901234',
        is_active: true,
        is_featured: false,
        session_price: '$30.000 / consulta',
        example: null,
        approach: 'Neurocognitivo y Rehabilitación',
        created_at: '2024-02-10T14:15:00Z',
        updated_at: '2024-06-04T11:20:00Z',
    },
    {
        id: 'prof-5',
        name: 'Lic. Lucía Navajas',
        slug: 'lic-lucia-navajas',
        title: 'Psicóloga Clínica y Docente de Mindfulness (MBSR)',
        license: 'M.N. 45.670',
        bio: 'Terapeuta de Aceptación y Compromiso (ACT) con certificación en Reducción del Estrés basada en la Atención Plena. Mi propósito es acompañarte a desarrollar una relación más amable con tu mente, cultivar autocompasión y aprender a actuar en dirección a tus valores auténticos, aún en presencia de la incomodidad o la ansiedad.',
        photo_url:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        gender: 'femenino',
        age: 38,
        birth_date: '1986-07-19',
        specialties: [
            'Mindfulness y ACT',
            'Ansiedad y Estrés',
            'Terapia Cognitivo Conductual (TCC)',
        ],
        insurances: ['Swiss Medical', 'OSDE', 'Omint', 'Particular'],
        modality: 'ambas',
        address: 'Av. Callao 1100, Recoleta, CABA',
        neighborhood: 'Recoleta',
        city: 'Buenos Aires',
        lat: -34.5955,
        lng: -58.3921,
        instagram_url: 'https://instagram.com/lic.lucianavajas',
        contact_email: 'lucia.navajas.psi@gmail.com',
        contact_phone: '+5491189012345',
        whatsapp_number: '5491189012345',
        is_active: true,
        is_featured: true,
        session_price: '$24.000 / sesión',
        example: null,
        approach: 'ACT y Terapias Basadas en Evidencia',
        created_at: '2024-02-14T16:00:00Z',
        updated_at: '2024-06-05T09:00:00Z',
    },
    {
        id: 'prof-6',
        name: 'Lic. Franco Zaccaria',
        slug: 'lic-franco-zaccaria',
        title: 'Psicólogo Humanista y Gestáltico',
        license: 'M.N. 50.392',
        bio: 'Terapeuta gestaltista enfocado en el autoconocimiento, la autenticidad y el despliegue del potencial personal. Trabajo especialmente con jóvenes y adultos en momentos de transición vocacional, crisis de sentido y problemas vinculares. Propongo un encuentro vivo, honesto y profundamente transformador.',
        photo_url:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        gender: 'masculino',
        age: 33,
        birth_date: '1991-09-02',
        specialties: ['Ansiedad y Estrés', 'Terapia Sistémica'],
        insurances: ['Galeno', 'Medifé', 'Particular'],
        modality: 'ambas',
        address: 'Malabia 1700, Villa Crespo, CABA',
        neighborhood: 'Villa Crespo',
        city: 'Buenos Aires',
        lat: -34.5947,
        lng: -58.434,
        instagram_url: 'https://instagram.com/franco.zaccaria.psi',
        contact_email: 'contacto@francozaccaria.com.ar',
        contact_phone: '+5491190123456',
        whatsapp_number: '5491190123456',
        is_active: true,
        is_featured: false,
        session_price: '$21.000 / sesión',
        example: null,
        approach: 'Gestáltico e Integrativo',
        created_at: '2024-02-20T10:30:00Z',
        updated_at: '2024-06-06T14:10:00Z',
    },
    {
        id: 'prof-7',
        name: 'Lic. Valeria Rossi',
        slug: 'lic-valeria-rossi',
        title: 'Especialista en Trauma Complejo y EMDR',
        license: 'M.N. 41.229',
        bio: 'Certificada por EMDR Institute y especialista en apego y trauma. Brindo un tratamiento focalizado y compasivo para personas que han vivido experiencias traumáticas, abusos, pérdidas abruptas o fobias complejas. La terapia EMDR facilita el reprocesamiento cerebral de memorias dolorosas para que dejen de perturbar el presente.',
        photo_url:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        gender: 'femenino',
        age: 46,
        birth_date: '1978-01-30',
        specialties: ['Trauma y EMDR', 'Depresión y Duelo', 'Psicoanálisis'],
        insurances: ['Particular', 'OSDE', 'Swiss Medical'],
        modality: 'presencial',
        address: 'Av. Montes de Oca 700, Barracas, CABA',
        neighborhood: 'Barracas',
        city: 'Buenos Aires',
        lat: -34.6341,
        lng: -58.3754,
        instagram_url: 'https://instagram.com/valeriarossi.terapia',
        contact_email: 'valeria.rossi.psico@gmail.com',
        contact_phone: '+5491123456789',
        whatsapp_number: '5491123456789',
        is_active: true,
        is_featured: false,
        session_price: '$28.000 / sesión',
        example: null,
        approach: 'EMDR y Abordaje del Trauma',
        created_at: '2024-03-01T12:00:00Z',
        updated_at: '2024-06-07T16:20:00Z',
    },
    {
        id: 'prof-8',
        name: 'Lic. Julián Soria',
        slug: 'lic-julian-soria',
        title: 'Psicólogo Cognitivo Conductual - Especialista en TOC',
        license: 'M.N. 56.402',
        bio: 'Dedicado al tratamiento de Trastorno Obsesivo Compulsivo (TOC), ataques de pánico y agorafobia mediante Exposición con Prevención de Respuesta (EPR) y reestructuración cognitiva. Modalidad 100% online con protocolos estructurados, ejercicios entre sesiones y seguimiento personalizado.',
        photo_url:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        gender: 'masculino',
        age: 31,
        birth_date: '1993-05-18',
        specialties: ['Terapia Cognitivo Conductual (TCC)', 'Ansiedad y Estrés'],
        insurances: ['Swiss Medical', 'Medifé', 'Particular'],
        modality: 'online',
        address: 'Av. Maipú 2300, Olivos, Vicente López',
        neighborhood: 'Olivos',
        city: 'Zona Norte GBA',
        lat: -34.5167,
        lng: -58.4833,
        instagram_url: 'https://instagram.com/juliansoria.psi',
        contact_email: 'julian.soria.tcc@gmail.com',
        contact_phone: '+5491134567890',
        whatsapp_number: '5491134567890',
        is_active: true,
        is_featured: true,
        session_price: '$23.000 / sesión',
        example: null,
        approach: 'TCC y Exposición con Prevención de Respuesta',
        created_at: '2024-03-10T15:45:00Z',
        updated_at: '2024-06-08T18:00:00Z',
    },
    {
        id: 'prof-9',
        name: 'Lic. Mora Cárdenas',
        slug: 'lic-mora-cardenas',
        title: 'Psicología Clínica con Perspectiva de Género y Derechos Humanos',
        license: 'M.N. 52.890',
        bio: 'Espacio terapéutico afirmativo para identidades diversas, personas no binarias, trans y del colectivo LGBTIQ+. Acompañamiento en procesos de autoafirmación, deconstrucción vincular, ansiedad social y fortalecimiento de la autoestima en un marco de respeto incondicional y seguridad.',
        photo_url:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        gender: 'no-binario',
        age: 35,
        birth_date: '1989-10-10',
        specialties: ['Diversidad y Género', 'Ansiedad y Estrés'],
        insurances: ['IOMA', 'Particular', 'OSDE'],
        modality: 'ambas',
        address: 'Av. Triunvirato 3800, Villa Urquiza, CABA',
        neighborhood: 'Villa Urquiza',
        city: 'Buenos Aires',
        lat: -34.5772,
        lng: -58.4735,
        instagram_url: 'https://instagram.com/mora.cardenas.psi',
        contact_email: 'mora.cardenas.terapia@gmail.com',
        contact_phone: '+5491145612345',
        whatsapp_number: '5491145612345',
        is_active: true,
        is_featured: false,
        session_price: '$20.000 / sesión',
        example: null,
        approach: 'Terapia Afirmativa y Perspectiva de Género',
        created_at: '2024-03-15T11:20:00Z',
        updated_at: '2024-06-09T13:00:00Z',
    },
    {
        id: 'prof-10',
        name: 'Lic. Paula Méndez',
        slug: 'lic-paula-mendez',
        title: 'Especialista en Salud Mental Perinatal y Crianza Respetuosa',
        license: 'M.N. 49.330',
        bio: 'Acompañamiento clínico integral en la búsqueda de embarazo, fertilidad asistida, gestación, postparto y puerperio. Espacio de sostén para madres y familias que transitan dudas, duelo perinatal, ansiedad ante la crianza temprana o depresión posparto.',
        photo_url:
            'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
        gender: 'femenino',
        age: 40,
        birth_date: '1984-06-22',
        specialties: ['Psicología Perinatal', 'Terapia de Pareja', 'Depresión y Duelo'],
        insurances: ['OSDE', 'Galeno', 'Swiss Medical', 'Particular'],
        modality: 'ambas',
        address: 'Av. del Libertador 4400, Las Cañitas, CABA',
        neighborhood: 'Las Cañitas',
        city: 'Buenos Aires',
        lat: -34.5684,
        lng: -58.4312,
        instagram_url: 'https://instagram.com/lic.paulamendez',
        contact_email: 'paula.mendez.perinatal@gmail.com',
        contact_phone: '+5491156723456',
        whatsapp_number: '5491156723456',
        is_active: true,
        is_featured: true,
        session_price: '$26.000 / sesión',
        example: null,
        approach: 'Perinatal y Vínculos Tempranos',
        created_at: '2024-03-20T17:00:00Z',
        updated_at: '2024-06-10T12:00:00Z',
    },
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: 'art-1',
        title: '¿Cómo saber qué tipo de terapia necesitás? Guía clara entre TCC, Psicoanálisis y Sistémica',
        slug: 'como-elegir-el-tipo-de-terapia-adecuado',
        cover_url:
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
        excerpt:
            'Comprender las diferencias entre las principales corrientes psicológicas te permite elegir un espacio que verdaderamente resuene con tus objetivos y tu momento vital.',
        content: `
Dar el primer paso hacia la terapia es una decisión valiente y necesaria. Sin embargo, muchas personas se sienten abrumadas ante la multiplicidad de enfoques psicológicos disponibles.

### 1. Terapia Cognitivo-Conductual (TCC)
La TCC es un modelo estructurado, enfocado en el presente y orientado a objetivos específicos. Trabaja sobre la relación dialéctica entre nuestros pensamientos, emociones y conductas. Si estás transitando ataques de pánico, fobias específicas, ansiedad generalizada o procrastinación, la TCC te brindará herramientas prácticas y ejercicios concretos desde las primeras sesiones.

### 2. Psicoanálisis
El psicoanálisis invita a un viaje profundo hacia el inconsciente y tu historia singular. No busca únicamente aplacar el síntoma de forma inmediata, sino entender qué función cumple en tu vida psíquica y cómo tus vivencias infantiles o vínculos tempranos siguen operando en el presente. Es ideal para quienes sienten una angustia existencial difusa, patrones afectivos repetitivos o el deseo de comprenderse a sí mismos a fondo.

### 3. Terapia Sistémica
La psicología sistémica pone el foco en las interacciones y dinámicas dentro de los grupos humanos: familias, parejas y entornos laborales. En lugar de mirar a la persona como un ente aislado, comprende que el sufrimiento suele ser emergente de un sistema de comunicación disfuncional.

### ¿Cuál es la mejor opción?
No existe una corriente universalmente superior: la evidencia demuestra que el factor más determinante para el éxito terapéutico es la **alianza terapéutica**, es decir, el vínculo de confianza, seguridad y empatía que construyas con tu profesional.
    `,
        author: 'Lic. Sofía Valenzuela',
        author_role: 'Especialista en TCC y Ansiedad',
        reading_time_minutes: 6,
        tags: ['Terapia', 'Autoconocimiento', 'Salud Mental'],
        published_at: '2024-05-10T10:00:00Z',
        is_published: true,
    },
    {
        id: 'art-2',
        title: 'Ansiedad e hiperconexión: Claves psicológicas para calmar la mente sobrecargada',
        slug: 'ansiedad-e-hiperconexion-claves-para-calmar-la-mente',
        cover_url:
            'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
        excerpt:
            'El flujo incesante de notificaciones y la comparación social digital mantienen activo nuestro sistema de alarma biológico. Descubrí cómo recuperar tu serenidad.',
        content: `
Vivimos en una época sin precedentes: recibimos en un solo día más información y estímulos sensoriales que nuestros antepasados en un año completo. Esta sobrecarga sensorial constante suele pasar desapercibida, pero impacta de lleno en nuestra fisiología.

### El secuestro del sistema nervioso simpático
Cuando el teléfono suena o vemos historias de vidas aparentemente perfectas, nuestro cerebro primitivo activa microrrespuestas de alerta: elevación del cortisol, tensión muscular en hombros y mandíbula, y respiración corta.

### Pequeños hábitos con gran impacto
1. **Primeros y últimos 30 minutos sin pantallas:** Permití que tu cerebro despierte con la luz natural y concilie el sueño sin la interferencia de luz azul.
2. **Micro-pausas de respiración diafragmática:** Tres inhalaciones lentas por la nariz y exhalaciones prolongadas por la boca activan el nervio vago y envían una señal inequívoca al cuerpo: *"estás a salvo"*.
3. **Ponerle nombre a la emoción:** Cuando sientas ansiedad, evitá juzgarte. Decite a vos mismo: *"Esto que siento es una ola de ansiedad, es temporal y va a pasar"*.
    `,
        author: 'Lic. Lucía Navajas',
        author_role: 'Docente de Mindfulness (MBSR)',
        reading_time_minutes: 5,
        tags: ['Ansiedad', 'Mindfulness', 'Bienestar Digital'],
        published_at: '2024-05-18T14:30:00Z',
        is_published: true,
    },
    {
        id: 'art-3',
        title: 'Terapia presencial vs. online: ¿Tienen la misma eficacia clínica demostrada?',
        slug: 'terapia-presencial-vs-online-eficacia-clinica',
        cover_url:
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        excerpt:
            'La pandemia aceleró la digitalización de la salud mental. Analizamos qué dicen las investigaciones científicas sobre la efectividad de la terapia remota.',
        content: `
Una de las preguntas más frecuentes que nos hacen en la agencia es: *¿La terapia online funciona de verdad o es solo un paliativo?*

La respuesta respaldada por más de 50 ensayos clínicos y metaanálisis (como los publicados en la revista *The Lancet Psychiatry*) es contundente: **la terapia online tiene una efectividad equivalente a la presencial** para la gran mayoría de los motivos de consulta, incluidos trastornos de ansiedad, depresión moderada y crisis vitales.

### Ventajas de la modalidad online
- **Ahorro de tiempo y traslados:** No necesitás viajar ni lidiar con el tránsito.
- **Acceso a los mejores profesionales:** Podés atenderte con un especialista en tu problemática aunque viva en otra ciudad o país.
- **Comodidad del entorno propio:** Muchas personas se sienten más seguras y abiertas hablando desde su propio sillón o habitación.

### Cuándo se sugiere la presencialidad
La modalidad presencial sigue siendo la más recomendada en cuadros severos de ideación suicida activa, niños pequeños que requieren juego físico en consultorio, o cuando el paciente no cuenta con privacidad absoluta en su hogar.
    `,
        author: 'Lic. Franco Zaccaria',
        author_role: 'Psicólogo Clínico',
        reading_time_minutes: 4,
        tags: ['Terapia Online', 'Ciencia', 'Consultorio'],
        published_at: '2024-05-25T11:00:00Z',
        is_published: true,
    },
    {
        id: 'art-4',
        title: 'Ataques de pánico: Por qué el cuerpo reacciona con taquicardia y falta de aire',
        slug: 'ataques-de-panico-que-le-pasa-al-cuerpo',
        cover_url:
            'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
        excerpt:
            'El ataque de pánico es una falsa alarma del sistema de supervivencia. Aprender cómo funciona el circuito biológico es el primer paso para desarmar el miedo.',
        content: `
El pánico se siente terrorífico porque sus síntomas físicos simulan una emergencia médica inminente: taquicardia, opresión en el pecho, sensación de asfixia y mareo.

### La falsa alarma de la amígdala
La amígdala cerebral es nuestro detector de humo biológico. Ante una amenaza real (como un incendio), prepara el cuerpo para huir o luchar bombeando sangre a los músculos principales. En un ataque de pánico, esta respuesta se dispara en ausencia de un peligro externo real.

Es crucial recordar una verdad médica absoluta: **ningún ataque de pánico produce un infarto ni asfixia**. Tu cuerpo simplemente está hiperventilando. Con terapia cognitivo-conductual y psicoeducación, es posible recuperar la confianza en tu propio cuerpo.
    `,
        author: 'Lic. Julián Soria',
        author_role: 'Especialista en TOC y Fobias',
        reading_time_minutes: 5,
        tags: ['Pánico', 'Salud Física', 'TCC'],
        published_at: '2024-06-02T09:15:00Z',
        is_published: true,
    },
    {
        id: 'art-5',
        title: 'Límites saludables: Cómo aprender a decir "no" sin sentir culpa ni egoísmo',
        slug: 'limites-saludables-aprender-a-decir-no-sin-culpa',
        cover_url:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        excerpt:
            'Decir que sí para no defraudar a los demás suele significar decirse que no a uno mismo. Descubrí cómo proteger tu energía con asertividad y respeto.',
        content: `
Muchas personas crecen con la creencia implícita de que ser "buenas personas" equivale a estar siempre disponibles, complacer a los demás y jamás incomodar. Esta tendencia a complacer sistemáticamente genera resentimiento silencioso y agotamiento emocional.

### Los límites no alejan, ordenan el amor
Un límite no es una agresión ni un muro de distanciamiento; es un manual de instrucciones sobre cómo cuidarnos y cuidar el vínculo. Decir: *"Te quiero mucho, pero este fin de semana necesito descansar y no podré acompañarte"* es un acto de honestidad que previene el desgaste vincular.
    `,
        author: 'Lic. Camila Restrepo',
        author_role: 'Terapeuta Sistémica y Familiar',
        reading_time_minutes: 6,
        tags: ['Vínculos', 'Autoestima', 'Comunicación'],
        published_at: '2024-06-08T15:00:00Z',
        is_published: true,
    },
];
