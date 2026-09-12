import {
  mentalAnalysisTopics,
  type MentalAnalysis,
  type MentalAnalysisInput,
} from './mental-analysis';

function isMentalAnalysis(value: unknown): value is MentalAnalysis {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return (
    (result.careLevel === 0 ||
      result.careLevel === 1 ||
      result.careLevel === 2 ||
      result.careLevel === 3) &&
    ['wellbeing', 'mild', 'moderate', 'urgent'].includes(
      String(result.severity),
    ) &&
    typeof result.title === 'string' &&
    typeof result.body === 'string' &&
    typeof result.action === 'string' &&
    mentalAnalysisTopics.includes(
      result.topic as (typeof mentalAnalysisTopics)[number],
    ) &&
    typeof result.specialty === 'string' &&
    typeof result.crisis === 'boolean' &&
    Array.isArray(result.signals) &&
    result.signals.every((signal) => typeof signal === 'string') &&
    result.provider === 'catharsa-step-care-v1'
  );
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { error?: unknown };
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // The generic message below also covers non-JSON upstream responses.
  }
  return 'Analisis belum dapat diproses. Silakan coba lagi.';
}

export async function requestMentalAnalysis(
  input: MentalAnalysisInput,
  options: { signal?: AbortSignal } = {},
): Promise<MentalAnalysis> {
  let response: Response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError')
      throw error;
    throw new Error(
      'Tidak dapat terhubung ke layanan analisis. Periksa koneksi lalu coba lagi.',
    );
  }

  if (!response.ok) throw new Error(await readErrorMessage(response));

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      'Layanan analisis mengirim respons yang tidak dapat dibaca.',
    );
  }

  if (!isMentalAnalysis(payload)) {
    throw new Error('Layanan analisis mengirim hasil yang tidak lengkap.');
  }
  return payload;
}
