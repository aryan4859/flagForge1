import crypto from 'crypto';

/**
 * Leet speak character mapping
 */
const LEET_MAP: Record<string, string> = {
    'A': 'Aa4', 'B': 'Bb68', 'C': 'Cc',
    'D': 'Dd', 'E': 'Ee3', 'F': 'Ff1',
    'G': 'Gg69', 'H': 'Hh', 'I': 'Ii1l',
    'J': 'Jj', 'K': 'Kk', 'L': 'Ll1I',
    'M': 'Mm', 'N': 'Nn', 'O': 'Oo0',
    'P': 'Pp', 'Q': 'Qq9', 'R': 'Rr',
    'S': 'Ss5', 'T': 'Tt7', 'U': 'Uu',
    'V': 'Vv', 'W': 'Ww', 'X': 'Xx',
    'Y': 'Yy', 'Z': 'Zz2', '0': '0oO',
    '1': '1lI', '2': '2zZ', '3': '3eE',
    '4': '4aA', '5': '5Ss', '6': '6Gb',
    '7': '7T', '8': '8bB', '9': '9g'
};

/**
 * Complex leet speak with special characters
 */
const CLEET_MAP: Record<string, string> = {
    'A': 'Aa4@', 'B': 'Bb68', 'C': 'Cc(',
    'D': 'Dd', 'E': 'Ee3', 'F': 'Ff1',
    'G': 'Gg69', 'H': 'Hh', 'I': 'Ii1l!',
    'J': 'Jj', 'K': 'Kk', 'L': 'Ll1I!',
    'M': 'Mm', 'N': 'Nn', 'O': 'Oo0#',
    'P': 'Pp', 'Q': 'Qq9', 'R': 'Rr',
    'S': 'Ss5$', 'T': 'Tt7', 'U': 'Uu',
    'V': 'Vv', 'W': 'Ww', 'X': 'Xx',
    'Y': 'Yy', 'Z': 'Zz2?', '0': '0oO#',
    '1': '1lI', '2': '2zZ?', '3': '3eE',
    '4': '4aA', '5': '5Ss', '6': '6Gb',
    '7': '7T', '8': '8B&', '9': '9g'
};

/**
 * Generate a random GUID
 */
export function generateGUID(): string {
    return crypto.randomUUID();
}

/**
 * Generate a team hash based on user ID and question ID
 * Similar to GZCTf's team hash implementation
 */
export function generateTeamHash(userId: string, questionId: string, salt?: string): string {
    const combinedSalt = salt || process.env.FLAG_SALT || 'default-salt';
    const data = `${combinedSalt}::${userId}::${questionId}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    // Return middle 12 characters like GZCTf
    return hash.substring(12, 24);
}

/**
 * Apply leet speak transformation to a string
 */
export function applyLeetSpeak(text: string, useComplex: boolean = false): string {
    const map = useComplex ? CLEET_MAP : LEET_MAP;
    let result = '';

    for (const char of text) {
        const upperChar = char.toUpperCase();
        if (map[upperChar]) {
            const options = map[upperChar];
            // Randomly select one of the possible replacements
            result += options[Math.floor(Math.random() * options.length)];
        } else if (char === ' ') {
            result += '_';
        } else {
            result += char;
        }
    }

    return result;
}

/**
 * Calculate entropy of a leet string
 */
export function calculateEntropy(text: string, useComplex: boolean = false): number {
    const map = useComplex ? CLEET_MAP : LEET_MAP;
    let entropy = 0;

    for (const char of text) {
        const upperChar = char.toUpperCase();
        if (map[upperChar]) {
            const options = map[upperChar].length;
            entropy += Math.log2(options);
        }
    }

    return entropy;
}

/**
 * Generate a dynamic flag based on template
 */
export function generateDynamicFlag(
    template: string,
    userId: string,
    questionId: string,
    salt?: string
): { flag: string; type: 'GUID' | 'TEAM_HASH' | 'LEET' | 'CLEET' } {
    // Empty template - generate random GUID
    if (!template || template.trim() === '') {
        return {
            flag: `flag{${generateGUID()}}`,
            type: 'GUID'
        };
    }

    // Check for markers
    const hasTeamHash = template.includes('[TEAM_HASH]');
    const hasGuid = template.includes('[GUID]');
    const hasLeet = template.startsWith('[LEET]');
    const hasCleet = template.startsWith('[CLEET]');

    let result = template;
    let type: 'GUID' | 'TEAM_HASH' | 'LEET' | 'CLEET' = 'GUID';

    // Remove markers
    if (hasLeet) {
        result = result.replace('[LEET]', '');
        type = 'LEET';
    }
    if (hasCleet) {
        result = result.replace('[CLEET]', '');
        type = 'CLEET';
    }

    // Replace GUID placeholder
    if (hasGuid) {
        result = result.replace('[GUID]', generateGUID());
        type = 'GUID';
    }

    // Replace TEAM_HASH placeholder
    if (hasTeamHash) {
        const teamHash = generateTeamHash(userId, questionId, salt);
        result = result.replace('[TEAM_HASH]', teamHash);
        type = 'TEAM_HASH';
    }

    // Apply leet speak if no placeholders or if LEET/CLEET marker present
    if ((!hasGuid && !hasTeamHash) || hasLeet || hasCleet) {
        const useComplex = hasCleet;

        // Check entropy for security
        const entropy = calculateEntropy(result, useComplex);
        if (entropy < 32 && !hasTeamHash) {
            throw new Error(`Flag template entropy (${entropy.toFixed(2)}) is below minimum requirement of 32 bits`);
        }

        result = applyLeetSpeak(result, useComplex);
        type = useComplex ? 'CLEET' : 'LEET';
    }

    return { flag: result, type };
}

/**
 * Validate if a flag matches (case-insensitive for leet speak)
 */
export function validateFlag(submittedFlag: string, storedFlag: string, flagType: string): boolean {
    // For GUID and TEAM_HASH, exact match required
    if (flagType === 'GUID' || flagType === 'TEAM_HASH') {
        return submittedFlag === storedFlag;
    }

    // For LEET and CLEET, case-insensitive comparison
    return submittedFlag.toLowerCase() === storedFlag.toLowerCase();
}
