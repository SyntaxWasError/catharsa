import {
  analyzeMentalState,
  parseMentalAnalysisInput,
} from '../../../lib/mental-analysis';

export const runtime = 'edge';

const jsonHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
};

export async function POST(request: Request) {
  let rawInput: unknown;
  try {
    rawInput = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Permintaan harus menggunakan JSON yang valid.',
      }),
      { status: 400, headers: jsonHeaders },
    );
  }

  try {
    const input = parseMentalAnalysisInput(rawInput);
    // A short, predictable pause makes the asynchronous state perceptible in the UI.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return new Response(JSON.stringify(analyzeMentalState(input)), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Data jurnal tidak dapat dianalisis.';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
}
