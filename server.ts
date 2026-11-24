
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ENQUIRIES_FILE = path.resolve(DATA_DIR, 'enquiries.json');

const ALLOWED_SERVICES = new Set<string>([
  'LED Boards',
  'Rolling Boards',
  'Digital Boards',
  'Flex Banners',
  'Backlight Flex',
  'Backdrops',
  'Hoardings',
  'Vinyl Printing',
  'Eco Vinyl',
  'Fabrication',
  'Fabric Print',
  'General Enquiry',
]);

interface EnquiryRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  description: string;
  submittedAt: string;
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';

  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    && email.length <= 160;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');

  return (
    digits.length >= 7 &&
    digits.length <= 15 &&
    /^[+\d\s()-]{7,24}$/.test(phone)
  );
}

async function persistEnquiry(record: EnquiryRecord): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing: EnquiryRecord[] = [];

  try {
    const raw = await fs.readFile(ENQUIRIES_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      existing = parsed as EnquiryRecord[];
    }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;

    if (code !== 'ENOENT') {
      throw err;
    }
  }

  existing.push(record);

  const tempFile = path.resolve(
    DATA_DIR,
    `enquiries.${crypto.randomUUID()}.tmp`
  );

  if (!tempFile.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid storage path');
  }

  await fs.writeFile(
    tempFile,
    JSON.stringify(existing, null, 2),
    'utf8'
  );

  await fs.rename(tempFile, ENQUIRIES_FILE);
}

async function startServer(): Promise<void> {
  const app = express();

  app.disable('x-powered-by');

  app.use(express.json({ limit: '64kb' }));

  // Health check API
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Submit enquiry API
  app.post('/api/enquiries', async (req: Request, res: Response) => {
    try {
      const body = req.body as Record<string, unknown> | null;

      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        res.status(400).json({
          error: 'Invalid request payload.',
        });
        return;
      }

      const name = sanitizeText(body.name, 100);
      const phone = sanitizeText(body.phone, 24);
      const email = sanitizeText(body.email, 160).toLowerCase();
      const service = sanitizeText(body.service, 60);
      const description = sanitizeText(body.description, 2000);

      const fieldErrors: Record<string, string> = {};

      if (name.length < 2) {
        fieldErrors.name =
          'Please enter your full name (at least 2 characters).';
      }

      if (!isValidPhone(phone)) {
        fieldErrors.phone =
          'Please enter a valid 7 to 15 digit phone number.';
      }

      if (!isValidEmail(email)) {
        fieldErrors.email =
          'Please enter a valid email address.';
      }

      if (!ALLOWED_SERVICES.has(service)) {
        fieldErrors.service =
          'Please select a valid printing or signage service.';
      }

      if (description.length < 10) {
        fieldErrors.description =
          'Please describe your project requirements (at least 10 characters).';
      }

      if (Object.keys(fieldErrors).length > 0) {
        res.status(400).json({
          error: 'Please review the highlighted fields and try again.',
          fieldErrors,
        });
        return;
      }

      const record: EnquiryRecord = {
        id: `PG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        name,
        phone,
        email,
        service,
        description,
        submittedAt: new Date().toISOString(),
      };

      await persistEnquiry(record);

      res.status(201).json({
        success: true,
        enquiryId: record.id,
        submittedAt: record.submittedAt,
        message:
          'Thank you! Your enquiry has been received. Ruban or our Coimbatore production desk will reach out shortly.',
      });
    } catch (err: unknown) {
      console.error('Failed to process enquiry submission:', err);

      res.status(500).json({
        error:
          'Unable to submit your enquiry right now. Please call 80564 41702 or message us on WhatsApp.',
      });
    }
  });

  // Vite development server
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production static files
    const distDir = path.resolve(process.cwd(), 'dist');

    app.use(express.static(distDir));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `Print Galaxy server listening on http://${HOST}:${PORT}`
    );
  });
}

startServer().catch((err: unknown) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
