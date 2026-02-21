import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Program {
    id: string;
    name: string;
    hospital: string;
    city: string;
    state: string;
    stateCode: string;
    specialty: string;
    subspecialty: string;
    eligibility: {
        usmleSteps: string[];
        visaTypes: string[];
        graduationCutoff: string;
        clinicalExperience: string;
        additionalNotes: string;
    };
    fee: string;
    duration: string;
    contact: {
        email: string;
        phone: string;
        website: string;
        coordinatorName: string;
    };
    applicationDeadline: string;
    acceptingApplications: boolean;
    lastVerified: string;
    lor: boolean;
    tags: string[];
    description: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const dataPath = path.join(__dirname, '..', 'data', 'programs.json');
const programs: Program[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function enrichProgram(program: Program): Promise<Partial<Program>> {
    const prompt = `You are a medical education data researcher. Search for information about this US Internal Medicine observership/clinical experience program:

Program Name: "${program.name}"
Current State: ${program.state}

Please provide ONLY factual, publicly available information. Return a JSON object with these fields (use null if information is not publicly available):
{
  "fee": "specific fee amount like $500/week or $2000/month, or null if unknown",
  "contact": {
    "email": "coordinator email or null",
    "phone": "phone number or null", 
    "website": "official program URL or null",
    "coordinatorName": "coordinator name or null"
  },
  "eligibility": {
    "usmleSteps": ["Step 1", "Step 2 CK"],
    "visaTypes": ["J1", "H1B"],
    "graduationCutoff": "Within X years or null",
    "clinicalExperience": "required/preferred/not required",
    "additionalNotes": "any specific notes about IMG eligibility"
  },
  "duration": "X-Y weeks or months",
  "applicationDeadline": "Rolling admissions or specific date",
  "acceptingApplications": true or false,
  "lor": true or false,
  "description": "2-3 sentence description of the program and what IMGs can expect"
}

IMPORTANT: 
- If fee is unknown, return "Contact program for fee details"
- Be conservative - only return information you are confident about
- For acceptingApplications, return true unless you specifically know they are closed
- Return ONLY the JSON object, no other text`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return {};
        const data = JSON.parse(jsonMatch[0]);

        // Merge with existing data, keeping existing if enriched is null
        return {
            fee: data.fee || program.fee,
            duration: data.duration || program.duration,
            applicationDeadline: data.applicationDeadline || program.applicationDeadline,
            acceptingApplications: data.acceptingApplications ?? program.acceptingApplications,
            lor: data.lor ?? program.lor,
            description: data.description || program.description,
            contact: {
                email: data.contact?.email || program.contact.email,
                phone: data.contact?.phone || program.contact.phone,
                website: data.contact?.website || program.contact.website,
                coordinatorName: data.contact?.coordinatorName || program.contact.coordinatorName,
            },
            eligibility: {
                usmleSteps: data.eligibility?.usmleSteps?.length ? data.eligibility.usmleSteps : program.eligibility.usmleSteps,
                visaTypes: data.eligibility?.visaTypes?.length ? data.eligibility.visaTypes : program.eligibility.visaTypes,
                graduationCutoff: data.eligibility?.graduationCutoff || program.eligibility.graduationCutoff,
                clinicalExperience: data.eligibility?.clinicalExperience || program.eligibility.clinicalExperience,
                additionalNotes: data.eligibility?.additionalNotes || program.eligibility.additionalNotes,
            },
            lastVerified: new Date().toISOString().split('T')[0],
        };
    } catch (err) {
        console.warn(`⚠️  Could not enrich ${program.name}: ${err}`);
        return { lastVerified: new Date().toISOString().split('T')[0] };
    }
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log(`🔄 Starting AI enrichment for ${programs.length} programs...`);
    const updated: Program[] = [];
    let changed = 0;

    // Process in batches of 10 to avoid rate limits
    const BATCH_SIZE = 10;
    const DELAY_MS = 2000;

    for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        console.log(`[${i + 1}/${programs.length}] Processing: ${program.name}`);

        const enriched = await enrichProgram(program);
        const updatedProgram = { ...program, ...enriched };
        updated.push(updatedProgram);

        const wasChanged = JSON.stringify(enriched) !== '{}';
        if (wasChanged) changed++;

        // Save progress every 50 programs
        if ((i + 1) % 50 === 0) {
            fs.writeFileSync(dataPath, JSON.stringify([...updated, ...programs.slice(i + 1)], null, 2));
            console.log(`💾 Saved progress at ${i + 1} programs`);
        }

        // Rate limit delay every batch
        if ((i + 1) % BATCH_SIZE === 0) {
            await delay(DELAY_MS);
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
    console.log(`✅ Update complete! ${changed} programs enriched → ${dataPath}`);
}

main().catch(console.error);
