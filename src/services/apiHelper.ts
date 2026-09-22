/**
 * Safe API response helper that verifies HTTP status, content-type,
 * prevents JSON.parse syntax errors on HTML responses, automatically retries
 * transient cold-boot / reverse-proxy HTML responses, and provides
 * human-readable Hindi/English fallback error messages.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  retries: number = 1
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text();

    if (!rawText || rawText.trim().length === 0) {
      if (!res.ok) {
        if (retries > 0 && res.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          return safeFetchJson<T>(url, options, retries - 1);
        }
        return {
          ok: false,
          status: res.status,
          data: null,
          error: `सर्वर त्रुटि (${res.status}): कोई उत्तर नहीं मिला।`,
        };
      }
      return { ok: true, status: res.status, data: null };
    }

    const trimmed = rawText.trim();

    // Guard against HTML error pages (<!DOCTYPE html>, <html>, etc.)
    if (
      trimmed.startsWith('<') ||
      trimmed.toLowerCase().startsWith('<!doctype') ||
      contentType.includes('text/html')
    ) {
      // If server is cold-booting or returning reverse proxy HTML, retry once after short delay
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return safeFetchJson<T>(url, options, retries - 1);
      }

      return {
        ok: false,
        status: res.status,
        data: null,
        error: res.ok
          ? 'सर्वर से अप्रत्याशित HTML उत्तर मिला। कृपया कुछ क्षणों में पुनः प्रयास करें।'
          : `सर्वर कनेक्शन में समस्या (${res.status})। कृपया पुनः प्रयास करें।`,
      };
    }

    // Try direct JSON parse
    try {
      const parsed = JSON.parse(trimmed) as T;
      if (!res.ok) {
        const errObj = parsed as any;
        return {
          ok: false,
          status: res.status,
          data: parsed,
          error: errObj?.error || `सर्वर त्रुटि (${res.status})`,
        };
      }
      return { ok: true, status: res.status, data: parsed };
    } catch {
      // Attempt substring extraction if response was decorated with markdown
      const firstBrace = trimmed.indexOf('{');
      const lastBrace = trimmed.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          const candidate = JSON.parse(trimmed.substring(firstBrace, lastBrace + 1)) as T;
          return { ok: res.ok, status: res.status, data: candidate };
        } catch {
          // Continue to error return
        }
      }

      return {
        ok: false,
        status: res.status,
        data: null,
        error: 'सर्वर उत्तर को पढ़ने में समस्या हुई। कृपया पुनः प्रयास करें।',
      };
    }
  } catch (netErr: any) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return safeFetchJson<T>(url, options, retries - 1);
    }

    return {
      ok: false,
      status: 0,
      data: null,
      error: netErr?.message || 'नेटवर्क कनेक्शन में समस्या है। कृपया इंटरनेट जांचें।',
    };
  }
}
