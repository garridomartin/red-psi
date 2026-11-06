--seed.sql
-- ============================================================
-- SEED DE DESARROLLO - RED ÉPSILON
-- Basado en mockData.ts + types/index.ts
-- Idempotente: TRUNCATE + INSERT
-- Ejecutar: psql -d red_epsilon -f supabase/seed.sql
-- O dentro de psql: \i 'ruta/a/supabase/seed.sql'
-- ============================================================

-- 1) LIMPIEZA (no toca users para no borrar el admin)
TRUNCATE TABLE 
  public.favorites, 
  public.contact_logs, 
  public.articles, 
  public.professionals, 
  public.insurances, 
  public.specialties 
CASCADE;

-- 2) USUARIO ADMIN DE PRUEBA
INSERT INTO public.users (id, email, name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'natalia.garrido17@gmail.com', 'Natalia Garrido', 'admin')
ON CONFLICT (email) DO UPDATE 
  SET role = 'admin', name = EXCLUDED.name;

-- 3) ESPECIALIDADES (12)
INSERT INTO public.specialties (id, name, slug, description) VALUES
('1',  'Terapia Cognitivo Conductual (TCC)', 'tcc',              'Enfoque práctico y orientado a metas para modificar patrones de pensamiento y conducta.'),
('2',  'Psicoanálisis',                       'psicoanalisis',    'Exploración del inconsciente, la historia vincular y los deseos profundos.'),
('3',  'Ansiedad y Estrés',                   'ansiedad-estres',  'Herramientas para la regulación emocional, crisis de pánico y sobreexigencia.'),
('4',  'Depresión y Duelo',                   'depresion-duelo',  'Acompañamiento en momentos de vacío, pérdidas afectivas y reconstrucción vital.'),
('5',  'Terapia de Pareja',                   'parejas',          'Comunicación asertiva, acuerdos vinculares y superación de conflictos en pareja.'),
('6',  'Terapia Sistémica',                   'sistemica',        'Análisis de dinámicas familiares, roles y sistemas relacionales.'),
('7',  'Mindfulness y ACT',                   'mindfulness-act',  'Terapia de Aceptación y Compromiso, flexibilidad psicológica y atención plena.'),
('8',  'Neuropsicología y Cognición',         'neuropsicologia',  'Evaluación y estimulación de funciones cerebrales y procesos cognitivos.'),
('9',  'Diversidad y Género',                 'diversidad-genero','Espacio seguro y afirmativo para la comunidad LGBTIQ+ y diversidad de género.'),
('10', 'Psicología Perinatal',                'perinatal',        'Acompañamiento en fertilidad, embarazo, puerperio y primeros años de crianza.'),
('11', 'Trauma y EMDR',                       'trauma-emdr',      'Procesamiento de vivencias traumáticas y desensibilización emocional.');

-- 4) OBRAS SOCIALES / PREPAGAS (8)
INSERT INTO public.insurances (id, name, slug, category) VALUES
('1', 'Particular',     'particular',    'particular'),
('2', 'OSDE',           'osde',          'prepaga'),
('3', 'Swiss Medical',  'swiss-medical', 'prepaga'),
('4', 'Galeno',         'galeno',        'prepaga'),
('5', 'Medifé',         'medife',        'prepaga'),
('6', 'Omint',          'omint',         'prepaga'),
('7', 'IOMA',           'ioma',          'obra-social'),
('8', 'Sancor Salud',   'sancor-salud',  'prepaga');

-- 5) PROFESIONALES (10)
INSERT INTO public.professionals (
  id, name, slug, title, license, bio, photo_url, gender, age, birth_date,
  specialties, insurances, modality, address, neighborhood, city, lat, lng,
  instagram_url, contact_email, contact_phone, whatsapp_number,
  session_price, approach, is_active, is_featured, created_at, updated_at, deleted_at
) VALUES
(
  'prof-1', 'Lic. Sofía Valenzuela', 'lic-sofia-valenzuela',
  'Licenciada en Psicología (UBA, Diploma de Honor)', 'M.N. 48.912',
  'Licenciada en Psicología con más de 9 años de experiencia clínica especializada en Terapia Cognitivo Conductual (TCC). Me apasiona brindar un espacio cálido, estructurado y basado en evidencia donde puedas comprender tus patrones de pensamiento, gestionar la ansiedad y recuperar el bienestar en tu vida diaria. Trabajo activamente con técnicas de reestructuración cognitiva y mindfulness.',
  'https://images.unsplash.com/photo-1594824813583-366a7ec65137?auto=format&fit=crop&w=800&q=80',
  'femenino', 34, '1990-04-12',
  ARRAY['Terapia Cognitivo Conductual (TCC)', 'Ansiedad y Estrés', 'Mindfulness y ACT'],
  ARRAY['OSDE', 'Swiss Medical', 'Particular'],
  'ambas', 'Av. Santa Fe 3200, Palermo, CABA', 'Palermo', 'Buenos Aires', -34.5885, -58.4112,
  'https://instagram.com/lic.sofiavalenzuela', 'sofia.valenzuela.psi@gmail.com', '+5491145678901', '5491145678901',
  '$22.000 / sesión', 'Cognitivo-Conductual y Mindfulness', true, true,
  '2024-01-15T10:00:00Z', '2024-06-01T12:00:00Z'
),
(
  'prof-2', 'Lic. Martín Echeverría', 'lic-martin-echeverria',
  'Psicólogo Clínico (UBA) - Miembro APdeBA', 'M.N. 39.420',
  'Más de 15 años de trayectoria en el abordaje psicoanalítico contemporáneo. Propongo un espacio de escucha atenta y sin juicios para desentrañar aquellos conflictos que generan malestar, repetición y angustia. Mi foco está en la singularidad de cada paciente, habilitando nuevas preguntas y caminos hacia una vida más plena y consciente.',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  'masculino', 42, '1982-08-25',
  ARRAY['Psicoanálisis', 'Depresión y Duelo', 'Terapia de Pareja'],
  ARRAY['OSDE', 'Galeno', 'Particular'],
  'presencial', 'Av. Corrientes 4500, Almagro, CABA', 'Almagro', 'Buenos Aires', -34.6042, -58.4278,
  'https://instagram.com/lic.martinecheverria', 'martin.echeverria@redpsicologos.com', '+5491156789012', '5491156789012',
  '$25.000 / sesión', 'Psicoanálisis Contemporáneo', true, true,
  '2024-01-18T11:00:00Z', '2024-06-02T15:00:00Z'
),
(
  'prof-3', 'Lic. Camila Restrepo', 'lic-camila-restrepo',
  'Psicóloga Sistémica & Terapeuta Familiar', 'M.N. 53.118',
  'Especialista en terapia vincular y dinámica familiar. Trabajo con parejas y personas individuales que desean mejorar su comunicación, resolver crisis afectivas y establecer acuerdos saludables. Atención 100% online con amplia flexibilidad horaria tanto para residentes de Argentina como personas viviendo en el exterior.',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
  'femenino', 29, '1995-11-14',
  ARRAY['Terapia Sistémica', 'Terapia de Pareja'],
  ARRAY['Medifé', 'Swiss Medical', 'Particular'],
  'online', 'Av. Cabildo 2100, Belgrano, CABA', 'Belgrano', 'Buenos Aires', -34.5623, -58.4561,
  'https://instagram.com/camila.psicologia', 'lic.camila.restrepo@gmail.com', '+5491167890123', '5491167890123',
  '$20.000 / sesión', 'Sistémico y Relacional', true, true,
  '2024-02-01T09:30:00Z', '2024-06-03T10:00:00Z'
),
(
  'prof-4', 'Dr. Alejandro Gómez Benítez', 'dr-alejandro-gomez-benitez',
  'Doctor en Psicología y Neuropsicología Clínica', 'M.N. 31.804',
  'Especializado en diagnóstico neuropsicológico, funciones ejecutivas y estimulación cognitiva en adultos y adultos mayores. Más de 20 años en docencia e investigación clínica. Realizo evaluaciones integrales de memoria, atención y lenguaje para brindar estrategias terapéuticas de alto impacto en la calidad de vida.',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
  'masculino', 54, '1970-03-05',
  ARRAY['Neuropsicología y Cognición', 'Depresión y Duelo'],
  ARRAY['OSDE', 'IOMA', 'Galeno', 'Particular'],
  'presencial', 'Av. Rivadavia 6200, Caballito, CABA', 'Caballito', 'Buenos Aires', -34.6234, -58.4452,
  'https://instagram.com/dr.alejandrogomez', 'gomez.benitez.neuro@gmail.com', '+5491178901234', '5491178901234',
  '$30.000 / consulta', 'Neurocognitivo y Rehabilitación', true, false,
  '2024-02-10T14:15:00Z', '2024-06-04T11:20:00Z'
),
(
  'prof-5', 'Lic. Lucía Navajas', 'lic-lucia-navajas',
  'Psicóloga Clínica y Docente de Mindfulness (MBSR)', 'M.N. 45.670',
  'Terapeuta de Aceptación y Compromiso (ACT) con certificación en Reducción del Estrés basada en la Atención Plena. Mi propósito es acompañarte a desarrollar una relación más amable con tu mente, cultivar autocompasión y aprender a actuar en dirección a tus valores auténticos, aún en presencia de la incomodidad o la ansiedad.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'femenino', 38, '1986-07-19',
  ARRAY['Mindfulness y ACT', 'Ansiedad y Estrés', 'Terapia Cognitivo Conductual (TCC)'],
  ARRAY['Swiss Medical', 'OSDE', 'Omint', 'Particular'],
  'ambas', 'Av. Callao 1100, Recoleta, CABA', 'Recoleta', 'Buenos Aires', -34.5955, -58.3921,
  'https://instagram.com/lic.lucianavajas', 'lucia.navajas.psi@gmail.com', '+5491189012345', '5491189012345',
  '$24.000 / sesión', 'ACT y Terapias Basadas en Evidencia', true, true,
  '2024-02-14T16:00:00Z', '2024-06-05T09:00:00Z'
),
(
  'prof-6', 'Lic. Franco Zaccaria', 'lic-franco-zaccaria',
  'Psicólogo Humanista y Gestáltico', 'M.N. 50.392',
  'Terapeuta gestaltista enfocado en el autoconocimiento, la autenticidad y el despliegue del potencial personal. Trabajo especialmente con jóvenes y adultos en momentos de transición vocacional, crisis de sentido y problemas vinculares. Propongo un encuentro vivo, honesto y profundamente transformador.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'masculino', 33, '1991-09-02',
  ARRAY['Ansiedad y Estrés', 'Terapia Sistémica'],
  ARRAY['Galeno', 'Medifé', 'Particular'],
  'ambas', 'Malabia 1700, Villa Crespo, CABA', 'Villa Crespo', 'Buenos Aires', -34.5947, -58.4340,
  'https://instagram.com/franco.zaccaria.psi', 'contacto@francozaccaria.com.ar', '+5491190123456', '5491190123456',
  '$21.000 / sesión', 'Gestáltico e Integrativo', true, false,
  '2024-02-20T10:30:00Z', '2024-06-06T14:10:00Z'
),
(
  'prof-7', 'Lic. Valeria Rossi', 'lic-valeria-rossi',
  'Especialista en Trauma Complejo y EMDR', 'M.N. 41.229',
  'Certificada por EMDR Institute y especialista en apego y trauma. Brindo un tratamiento focalizado y compasivo para personas que han vivido experiencias traumáticas, abusos, pérdidas abruptas o fobias complejas. La terapia EMDR facilita el reprocesamiento cerebral de memorias dolorosas para que dejen de perturbar el presente.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  'femenino', 46, '1978-01-30',
  ARRAY['Trauma y EMDR', 'Depresión y Duelo', 'Psicoanálisis'],
  ARRAY['Particular', 'OSDE', 'Swiss Medical'],
  'presencial', 'Av. Montes de Oca 700, Barracas, CABA', 'Barracas', 'Buenos Aires', -34.6341, -58.3754,
  'https://instagram.com/valeriarossi.terapia', 'valeria.rossi.psico@gmail.com', '+5491123456789', '5491123456789',
  '$28.000 / sesión', 'EMDR y Abordaje del Trauma', true, false,
  '2024-03-01T12:00:00Z', '2024-06-07T16:20:00Z'
),
(
  'prof-8', 'Lic. Julián Soria', 'lic-julian-soria',
  'Psicólogo Cognitivo Conductual - Especialista en TOC', 'M.N. 56.402',
  'Dedicado al tratamiento de Trastorno Obsesivo Compulsivo (TOC), ataques de pánico y agorafobia mediante Exposición con Prevención de Respuesta (EPR) y reestructuración cognitiva. Modalidad 100% online con protocolos estructurados, ejercicios entre sesiones y seguimiento personalizado.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'masculino', 31, '1993-05-18',
  ARRAY['Terapia Cognitivo Conductual (TCC)', 'Ansiedad y Estrés'],
  ARRAY['Swiss Medical', 'Medifé', 'Particular'],
  'online', 'Av. Maipú 2300, Olivos, Vicente López', 'Olivos', 'Zona Norte GBA', -34.5167, -58.4833,
  'https://instagram.com/juliansoria.psi', 'julian.soria.tcc@gmail.com', '+5491134567890', '5491134567890',
  '$23.000 / sesión', 'TCC y Exposición con Prevención de Respuesta', true, true,
  '2024-03-10T15:45:00Z', '2024-06-08T18:00:00Z'
),
(
  'prof-9', 'Lic. Mora Cárdenas', 'lic-mora-cardenas',
  'Psicología Clínica con Perspectiva de Género y Derechos Humanos', 'M.N. 52.890',
  'Espacio terapéutico afirmativo para identidades diversas, personas no binarias, trans y del colectivo LGBTIQ+. Acompañamiento en procesos de autoafirmación, deconstrucción vincular, ansiedad social y fortalecimiento de la autoestima en un marco de respeto incondicional y seguridad.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'no-binario', 35, '1989-10-10',
  ARRAY['Diversidad y Género', 'Ansiedad y Estrés'],
  ARRAY['IOMA', 'Particular', 'OSDE'],
  'ambas', 'Av. Triunvirato 3800, Villa Urquiza, CABA', 'Villa Urquiza', 'Buenos Aires', -34.5772, -58.4735,
  'https://instagram.com/mora.cardenas.psi', 'mora.cardenas.terapia@gmail.com', '+5491145612345', '5491145612345',
  '$20.000 / sesión', 'Terapia Afirmativa y Perspectiva de Género', true, false,
  '2024-03-15T11:20:00Z', '2024-06-09T13:00:00Z'
),
(
  'prof-10', 'Lic. Paula Méndez', 'lic-paula-mendez',
  'Especialista en Salud Mental Perinatal y Crianza Respetuosa', 'M.N. 49.330',
  'Acompañamiento clínico integral en la búsqueda de embarazo, fertilidad asistida, gestación, postparto y puerperio. Espacio de sostén para madres y familias que transitan dudas, duelo perinatal, ansiedad ante la crianza temprana o depresión posparto.',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
  'femenino', 40, '1984-06-22',
  ARRAY['Psicología Perinatal', 'Terapia de Pareja', 'Depresión y Duelo'],
  ARRAY['OSDE', 'Galeno', 'Swiss Medical', 'Particular'],
  'ambas', 'Av. del Libertador 4400, Las Cañitas, CABA', 'Las Cañitas', 'Buenos Aires', -34.5684, -58.4312,
  'https://instagram.com/lic.paulamendez', 'paula.mendez.perinatal@gmail.com', '+5491156723456', '5491156723456',
  '$26.000 / sesión', 'Perinatal y Vínculos Tempranos', true, true,
  '2024-03-20T17:00:00Z', '2024-06-10T12:00:00Z'
),
(
  'prof-pausado-1', 'Lic. Ejemplo Pausado', 'lic-ejemplo-pausado',
  'Licenciado en Psicología (ejemplo)', 'M.N. 00.000',
  'Registro de prueba con deleted_at seteado para verificar el flujo de soft delete en el dashboard.',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
  'masculino', 40, '1985-01-01',
  ARRAY['Psicoanálisis'], ARRAY['Particular'],
  'online', 'Dirección de ejemplo', 'Palermo', 'Buenos Aires', -34.5885, -58.4112,
  'https://instagram.com/ejemplo', 'ejemplo@redpsicologos.com.ar', '+5491100000000', '5491100000000',
  '$0 / sesión', 'Ejemplo', true, false,
  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z',
  '2026-02-02T15:30:00Z'   -- 👈 ya pausado
);

-- 6) ARTÍCULOS (5)
INSERT INTO public.articles (
  id, title, slug, cover_url, excerpt, content, author, author_role,
  reading_time_minutes, tags, is_published, published_at, deleted_at
) VALUES
(
  'art-1',
  '¿Cómo saber qué tipo de terapia necesitás? Guía clara entre TCC, Psicoanálisis y Sistémica',
  'como-elegir-el-tipo-de-terapia-adecuado',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
  'Comprender las diferencias entre las principales corrientes psicológicas te permite elegir un espacio que verdaderamente resuene con tus objetivos y tu momento vital.',
  $art1$Dar el primer paso hacia la terapia es una decisión valiente y necesaria. Sin embargo, muchas personas se sienten abrumadas ante la multiplicidad de enfoques psicológicos disponibles.

### 1. Terapia Cognitivo-Conductual (TCC)
La TCC es un modelo estructurado, enfocado en el presente y orientado a objetivos específicos. Trabaja sobre la relación dialéctica entre nuestros pensamientos, emociones y conductas. Si estás transitando ataques de pánico, fobias específicas, ansiedad generalizada o procrastinación, la TCC te brindará herramientas prácticas y ejercicios concretos desde las primeras sesiones.

### 2. Psicoanálisis
El psicoanálisis invita a un viaje profundo hacia el inconsciente y tu historia singular. No busca únicamente aplacar el síntoma de forma inmediata, sino entender qué función cumple en tu vida psíquica y cómo tus vivencias infantiles o vínculos tempranos siguen operando en el presente. Es ideal para quienes sienten una angustia existencial difusa, patrones afectivos repetitivos o el deseo de comprenderse a sí mismos a fondo.

### 3. Terapia Sistémica
La psicología sistémica pone el foco en las interacciones y dinámicas dentro de los grupos humanos: familias, parejas y entornos laborales. En lugar de mirar a la persona como un ente aislado, comprende que el sufrimiento suele ser emergente de un sistema de comunicación disfuncional.

### ¿Cuál es la mejor opción?
No existe una corriente universalmente superior: la evidencia demuestra que el factor más determinante para el éxito terapéutico es la **alianza terapéutica**, es decir, el vínculo de confianza, seguridad y empatía que construyas con tu profesional.$art1$,
  'Lic. Sofía Valenzuela', 'Especialista en TCC y Ansiedad',
  6, ARRAY['Terapia', 'Autoconocimiento', 'Salud Mental'], true,
  '2024-05-10T10:00:00Z'
),
(
  'art-2',
  'Ansiedad e hiperconexión: Claves psicológicas para calmar la mente sobrecargada',
  'ansiedad-e-hiperconexion-claves-para-calmar-la-mente',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
  'El flujo incesante de notificaciones y la comparación social digital mantienen activo nuestro sistema de alarma biológico. Descubrí cómo recuperar tu serenidad.',
  $art2$Vivimos en una época sin precedentes: recibimos en un solo día más información y estímulos sensoriales que nuestros antepasados en un año completo. Esta sobrecarga sensorial constante suele pasar desapercibida, pero impacta de lleno en nuestra fisiología.

### El secuestro del sistema nervioso simpático
Cuando el teléfono suena o vemos historias de vidas aparentemente perfectas, nuestro cerebro primitivo activa microrrespuestas de alerta: elevación del cortisol, tensión muscular en hombros y mandíbula, y respiración corta.

### Pequeños hábitos con gran impacto
1. **Primeros y últimos 30 minutos sin pantallas:** Permití que tu cerebro despierte con la luz natural y concilie el sueño sin la interferencia de luz azul.
2. **Micro-pausas de respiración diafragmática:** Tres inhalaciones lentas por la nariz y exhalaciones prolongadas por la boca activan el nervio vago y envían una señal inequívoca al cuerpo: *"estás a salvo"*.
3. **Ponerle nombre a la emoción:** Cuando sientas ansiedad, evitá juzgarte. Decite a vos mismo: *"Esto que siento es una ola de ansiedad, es temporal y va a pasar"*.$art2$,
  'Lic. Lucía Navajas', 'Docente de Mindfulness (MBSR)',
  5, ARRAY['Ansiedad', 'Mindfulness', 'Bienestar Digital'], true,
  '2024-05-18T14:30:00Z'
),
(
  'art-3',
  'Terapia presencial vs. online: ¿Tienen la misma eficacia clínica demostrada?',
  'terapia-presencial-vs-online-eficacia-clinica',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  'La pandemia aceleró la digitalización de la salud mental. Analizamos qué dicen las investigaciones científicas sobre la efectividad de la terapia remota.',
  $art3$Una de las preguntas más frecuentes que nos hacen en la agencia es: *¿La terapia online funciona de verdad o es solo un paliativo?*

La respuesta respaldada por más de 50 ensayos clínicos y metaanálisis (como los publicados en la revista *The Lancet Psychiatry*) es contundente: **la terapia online tiene una efectividad equivalente a la presencial** para la gran mayoría de los motivos de consulta, incluidos trastornos de ansiedad, depresión moderada y crisis vitales.

### Ventajas de la modalidad online
- **Ahorro de tiempo y traslados:** No necesitás viajar ni lidiar con el tránsito.
- **Acceso a los mejores profesionales:** Podés atenderte con un especialista en tu problemática aunque viva en otra ciudad o país.
- **Comodidad del entorno propio:** Muchas personas se sienten más seguras y abiertas hablando desde su propio sillón o habitación.

### Cuándo se sugiere la presencialidad
La modalidad presencial sigue siendo la más recomendada en cuadros severos de ideación suicida activa, niños pequeños que requieren juego físico en consultorio, o cuando el paciente no cuenta con privacidad absoluta en su hogar.$art3$,
  'Lic. Franco Zaccaria', 'Psicólogo Clínico',
  4, ARRAY['Terapia Online', 'Ciencia', 'Consultorio'], true,
  '2024-05-25T11:00:00Z'
),
(
  'art-4',
  'Ataques de pánico: Por qué el cuerpo reacciona con taquicardia y falta de aire',
  'ataques-de-panico-que-le-pasa-al-cuerpo',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  'El ataque de pánico es una falsa alarma del sistema de supervivencia. Aprender cómo funciona el circuito biológico es el primer paso para desarmar el miedo.',
  $art4$El pánico se siente terrorífico porque sus síntomas físicos simulan una emergencia médica inminente: taquicardia, opresión en el pecho, sensación de asfixia y mareo.

### La falsa alarma de la amígdala
La amígdala cerebral es nuestro detector de humo biológico. Ante una amenaza real (como un incendio), prepara el cuerpo para huir o luchar bombeando sangre a los músculos principales. En un ataque de pánico, esta respuesta se dispara en ausencia de un peligro externo real.

Es crucial recordar una verdad médica absoluta: **ningún ataque de pánico produce un infarto ni asfixia**. Tu cuerpo simplemente está hiperventilando. Con terapia cognitivo-conductual y psicoeducación, es posible recuperar la confianza en tu propio cuerpo.$art4$,
  'Lic. Julián Soria', 'Especialista en TOC y Fobias',
  5, ARRAY['Pánico', 'Salud Física', 'TCC'], true,
  '2024-06-02T09:15:00Z'
),
(
  'art-5',
  'Límites saludables: Cómo aprender a decir "no" sin sentir culpa ni egoísmo',
  'limites-saludables-aprender-a-decir-no-sin-culpa',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'Decir que sí para no defraudar a los demás suele significar decirse que no a uno mismo. Descubrí cómo proteger tu energía con asertividad y respeto.',
  $art5$Muchas personas crecen con la creencia implícita de que ser "buenas personas" equivale a estar siempre disponibles, complacer a los demás y jamás incomodar. Esta tendencia a complacer sistemáticamente genera resentimiento silencioso y agotamiento emocional.

### Los límites no alejan, ordenan el amor
Un límite no es una agresión ni un muro de distanciamiento; es un manual de instrucciones sobre cómo cuidarnos y cuidar el vínculo. Decir: *"Te quiero mucho, pero este fin de semana necesito descansar y no podré acompañarte"* es un acto de honestidad que previene el desgaste vincular.$art5$,
  'Lic. Camila Restrepo', 'Terapeuta Sistémica y Familiar',
  6, ARRAY['Vínculos', 'Autoestima', 'Comunicación'], true,
  '2024-06-08T15:00:00Z'
),
(
  'art-pausado-1', 'Artículo de ejemplo pausado', 'articulo-ejemplo-pausado',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
  'Este artículo está pausado para probar el filtro del dashboard.',
  'Contenido de ejemplo. Este registro tiene deleted_at seteado.',
  'Admin', 'Admin',
  1, ARRAY['Ejemplo'], true, '2026-02-02T15:30:00Z',
  '2026-02-02T15:30:00Z'   -- 👈 ya pausado
);

-- 7) VERIFICACIÓN RÁPIDA (opcional, podés comentar estas líneas si no querés output)
SELECT 'specialties'  AS tabla, COUNT(*) FROM public.specialties
UNION ALL
SELECT 'insurances',   COUNT(*) FROM public.insurances
UNION ALL
SELECT 'professionals',COUNT(*) FROM public.professionals
UNION ALL
SELECT 'articles',     COUNT(*) FROM public.articles
UNION ALL
SELECT 'users',        COUNT(*) FROM public.users;