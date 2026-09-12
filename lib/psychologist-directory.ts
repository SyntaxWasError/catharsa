import { PSYCHOLOGISTS } from './catharsa-data';

export function filterDoctors(query: string, tag: string, sort: string) {
  const normalized = query.trim().toLocaleLowerCase('id-ID');

  return PSYCHOLOGISTS.filter(
    (doctor) =>
      `${doctor.name} ${doctor.credential} ${doctor.specialties.join(' ')}`
        .toLocaleLowerCase('id-ID')
        .includes(normalized) &&
      (tag === 'Semua' ||
        doctor.specialties.some((specialty) => specialty === tag)),
  )
    .slice()
    .sort((a, b) =>
      sort === 'alphabetical'
        ? a.name.localeCompare(b.name, 'id')
        : sort === 'specialty'
          ? a.specialties[0].localeCompare(b.specialties[0], 'id')
          : Number(b.available) - Number(a.available) ||
            a.name.localeCompare(b.name, 'id'),
    );
}
